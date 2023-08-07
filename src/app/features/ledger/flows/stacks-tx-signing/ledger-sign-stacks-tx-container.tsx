import { useEffect, useMemo, useState } from 'react';
import { Outlet, Route, useLocation, useNavigate } from 'react-router-dom';

import { deserializeTransaction } from '@stacks/transactions';
import { LedgerError } from '@zondax/ledger-stacks';
import get from 'lodash.get';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { delay } from '@app/common/utils';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import {
  LedgerTxSigningContext,
  LedgerTxSigningProvider,
  createWaitForUserToSeeWarningScreen,
} from '@app/features/ledger/generic-flows/tx-signing/ledger-sign-tx.context';
import {
  getStacksAppVersion,
  isVersionOfLedgerStacksAppWithContractPrincipalBug,
  prepareLedgerDeviceStacksAppConnection,
  signLedgerStacksTransaction,
  signStacksTransactionWithSignature,
  useActionCancellableByUser,
} from '@app/features/ledger/utils/stacks-ledger-utils';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useStacksTransactionBroadcast } from '@app/store/transactions/transaction.hooks';

import { ConnectLedgerSignTx } from '../../generic-flows/tx-signing/steps/connect-ledger-sign-tx';
import {
  ConnectLedgerError,
  ConnectLedgerSuccess,
  DeviceBusy,
  LedgerDeviceInvalidPayload,
  LedgerDisconnected,
  LedgerPublicKeyMismatch,
  OperationRejected,
  UnsupportedBrowserLayout,
} from '../../generic-steps';
import { LedgerBroadcastError } from '../../generic-steps/broadcast-error/broadcast-error';
import { useLedgerAnalytics } from '../../hooks/use-ledger-analytics.hook';
import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { useVerifyMatchingLedgerStacksPublicKey } from '../../hooks/use-verify-matching-stacks-public-key';
import { useLedgerResponseState } from '../../utils/generic-ledger-utils';
import { ApproveSignLedgerTx } from './steps/approve-sign-stacks-ledger-tx';
import { ContractPrincipalBugWarning } from './steps/contract-principal-bug-warning';

export const ledgerStacksTxSigningRoutes = (
  <Route element={<LedgerSignStacksTxContainer />}>
    <Route path={RouteUrls.ConnectLedger} element={<ConnectLedgerSignTx />} />
    <Route path={RouteUrls.DeviceBusy} element={<DeviceBusy />} />
    <Route path={RouteUrls.ConnectLedgerError} element={<ConnectLedgerError />} />
    <Route path={RouteUrls.LedgerUnsupportedBrowser} element={<UnsupportedBrowserLayout />} />
    <Route path={RouteUrls.ConnectLedgerSuccess} element={<ConnectLedgerSuccess />} />
    <Route path={RouteUrls.AwaitingDeviceUserAction} element={<ApproveSignLedgerTx />} />
    <Route path={RouteUrls.LedgerDisconnected} element={<LedgerDisconnected />} />
    <Route path={RouteUrls.LedgerOperationRejected} element={<OperationRejected />} />
    <Route path={RouteUrls.LedgerPublicKeyMismatch} element={<LedgerPublicKeyMismatch />} />
    <Route path={RouteUrls.LedgerDevicePayloadInvalid} element={<LedgerDeviceInvalidPayload />} />
    <Route path={RouteUrls.LedgerOutdatedAppWarning} element={<ContractPrincipalBugWarning />} />
    <Route path={RouteUrls.LedgerBroadcastError} element={<LedgerBroadcastError />} />
  </Route>
);

export function LedgerSignStacksTxContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const ledgerNavigate = useLedgerNavigate();
  const ledgerAnalytics = useLedgerAnalytics();
  useScrollLock(true);
  const account = useCurrentStacksAccount();
  const hwWalletTxBroadcast = useStacksTransactionBroadcast();
  const canUserCancelAction = useActionCancellableByUser();
  const verifyLedgerPublicKey = useVerifyMatchingLedgerStacksPublicKey();
  const [unsignedTransaction, setUnsignedTransaction] = useState<null | string>(null);

  const hasUserSkippedBuggyAppWarning = useMemo(() => createWaitForUserToSeeWarningScreen(), []);

  useEffect(() => {
    const tx = get(location.state, 'tx');
    if (tx) setUnsignedTransaction(tx);
  }, [location.state]);

  useEffect(() => () => setUnsignedTransaction(null), []);

  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();

  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);

  const signTransaction = async () => {
    if (!account) return;

    const stacksApp = await prepareLedgerDeviceStacksAppConnection({
      setLoadingState: setAwaitingDeviceConnection,
      onError() {
        ledgerNavigate.toErrorStep();
      },
    });

    const versionInfo = await getStacksAppVersion(stacksApp);
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

    if (isVersionOfLedgerStacksAppWithContractPrincipalBug(versionInfo)) {
      navigate(RouteUrls.LedgerOutdatedAppWarning);
      const response = await hasUserSkippedBuggyAppWarning.wait();

      if (response === 'cancelled-operation') {
        ledgerNavigate.cancelLedgerAction();
        return;
      }
    }

    ledgerNavigate.toDeviceBusyStep('Verifying public key on Ledger…');
    await verifyLedgerPublicKey(stacksApp);

    try {
      ledgerNavigate.toConnectionSuccessStep('stacks');
      await delay(1000);
      if (!unsignedTransaction) throw new Error('No unsigned tx');

      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: false });

      const resp = await signLedgerStacksTransaction(stacksApp)(
        Buffer.from(unsignedTransaction, 'hex'),
        account.index
      );

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

      const signedTx = signStacksTransactionWithSignature(unsignedTransaction, resp.signatureVRS);
      ledgerAnalytics.transactionSignedOnLedgerSuccessfully();

      try {
        await hwWalletTxBroadcast({ signedTx });
        navigate(RouteUrls.Activity);
      } catch (e) {
        ledgerNavigate.toBroadcastErrorStep(e instanceof Error ? e.message : 'Unknown error');
        return;
      }
    } catch (e) {
      ledgerNavigate.toDeviceDisconnectStep();
    } finally {
      await stacksApp.transport.close();
    }
  };

  const allowUserToGoBack = get(location.state, 'goBack');

  const ledgerContextValue: LedgerTxSigningContext = {
    chain: 'stacks',
    transaction: unsignedTransaction ? deserializeTransaction(unsignedTransaction) : null,
    signTransaction,
    latestDeviceResponse,
    awaitingDeviceConnection,
    hasUserSkippedBuggyAppWarning,
  };

  return (
    <LedgerTxSigningProvider value={ledgerContextValue}>
      <BaseDrawer
        enableGoBack={allowUserToGoBack}
        isShowing
        isWaitingOnPerformedAction={awaitingDeviceConnection || canUserCancelAction}
        onClose={ledgerNavigate.cancelLedgerAction}
        pauseOnClickOutside
        waitingOnPerformedActionMessage="Ledger device in use"
      >
        <Outlet />
      </BaseDrawer>
    </LedgerTxSigningProvider>
  );
}
