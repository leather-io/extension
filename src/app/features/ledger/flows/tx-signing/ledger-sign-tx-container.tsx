import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LedgerError } from '@zondax/ledger-stacks';
import get from 'lodash.get';

import { delay } from '@app/common/utils';
import {
  getAppVersion,
  prepareLedgerDeviceConnection,
  signLedgerTransaction,
  signTransactionWithSignature,
  useActionCancellableByUser,
  useLedgerResponseState,
} from '@app/features/ledger/ledger-utils';
import { deserializeTransaction } from '@stacks/transactions';
import {
  LedgerTxSigningContext,
  LedgerTxSigningProvider,
} from '@app/features/ledger/flows/tx-signing/ledger-sign-tx.context';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { useHardwareWalletTransactionBroadcast } from '@app/store/transactions/transaction.hooks';
import { RouteUrls } from '@shared/route-urls';
import { logger } from '@shared/logger';

import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { useLedgerAnalytics } from '../../hooks/use-ledger-analytics.hook';

export function LedgerSignTxContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const ledgerNavigate = useLedgerNavigate();
  const ledgerAnalytics = useLedgerAnalytics();
  useScrollLock(true);
  const account = useCurrentAccount();
  const hwWalletTxBroadcast = useHardwareWalletTransactionBroadcast();
  const canUserCancelAction = useActionCancellableByUser();

  const [unsignedTransaction, setUnsignedTransaction] = useState<null | string>(null);

  useEffect(() => {
    const tx = get(location.state, 'tx');
    if (tx) setUnsignedTransaction(tx);
  }, [location.state]);

  useEffect(() => () => setUnsignedTransaction(null), []);

  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();

  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);

  const signTransaction = async () => {
    if (!account) return;

    const stacksApp = await prepareLedgerDeviceConnection({
      setLoadingState: setAwaitingDeviceConnection,
      onError() {
        ledgerNavigate.toErrorStep();
      },
    });

    const versionInfo = await getAppVersion(stacksApp);
    ledgerAnalytics.trackDeviceVersionInfo(versionInfo);
    setLatestDeviceResponse(versionInfo);

    if (versionInfo.deviceLocked) {
      setAwaitingDeviceConnection(false);
      return;
    }

    if (versionInfo.returnCode !== LedgerError.NoErrors) {
      logger.error('Return code from device has error', versionInfo);
      return;
    }

    ledgerNavigate.toDeviceBusyStep('Verifying public key from Ledger…');
    await delay(1000);

    try {
      ledgerNavigate.toConnectionSuccessStep();
      await delay(1000);
      if (!unsignedTransaction) throw new Error('No unsigned tx');

      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: false });

      const resp = await signLedgerTransaction(stacksApp)(
        Buffer.from(unsignedTransaction, 'hex'),
        account.index
      );

      console.log(resp);

      // Assuming here that public keys are wrong. Alternatively, we may want
      // to proactively check the key before signing
      if (resp.returnCode === LedgerError.DataIsInvalid) {
        ledgerNavigate.toDevicePayloadInvalid();
        return;
      }

      if (resp.returnCode === LedgerError.TransactionRejected) {
        ledgerNavigate.toOperationRejectedStep();
        ledgerAnalytics.transactionSignedOnLedgerRejected();

        return;
      }

      if (resp.returnCode !== LedgerError.NoErrors) {
        throw new Error('Some other error');
      }

      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: true });

      await delay(1000);

      const signedTx = signTransactionWithSignature(unsignedTransaction, resp.signatureVRS);
      ledgerAnalytics.transactionSignedOnLedgerSuccessfully();

      await hwWalletTxBroadcast({ signedTx });

      navigate(RouteUrls.Home);
      await stacksApp.transport.close();
    } catch (e) {
      ledgerNavigate.toDeviceDisconnectStep();
    }
  };

  const allowUserToGoBack = get(location.state, 'goBack');
  const onCancelConnectLedger = allowUserToGoBack
    ? ledgerNavigate.cancelLedgerActionAndReturnHome
    : ledgerNavigate.cancelLedgerAction;

  const ledgerContextValue: LedgerTxSigningContext = {
    transaction: unsignedTransaction ? deserializeTransaction(unsignedTransaction) : null,
    signTransaction,
    latestDeviceResponse,
    awaitingDeviceConnection,
  };

  return (
    <LedgerTxSigningProvider value={ledgerContextValue}>
      <BaseDrawer
        enableGoBack={allowUserToGoBack}
        isShowing
        isWaitingOnPerformedAction={awaitingDeviceConnection || canUserCancelAction}
        onClose={onCancelConnectLedger}
        pauseOnClickOutside
        waitingOnPerformedActionMessage="Ledger device in use"
      >
        <Outlet />
      </BaseDrawer>
    </LedgerTxSigningProvider>
  );
}
