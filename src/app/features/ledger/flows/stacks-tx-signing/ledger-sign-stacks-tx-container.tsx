import { useEffect, useMemo, useState } from 'react';
import { Outlet, Route, useLocation, useNavigate } from 'react-router-dom';

import { deserializeTransaction } from '@stacks/transactions';
import { LedgerError } from '@zondax/ledger-stacks';
import get from 'lodash.get';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { appEvents } from '@app/common/publish-subscribe';
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

import { ledgerSignTxRoutes } from '../../generic-flows/tx-signing/ledger-sign-tx-route-generator';
import { useLedgerAnalytics } from '../../hooks/use-ledger-analytics.hook';
import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { useVerifyMatchingLedgerStacksPublicKey } from '../../hooks/use-verify-matching-stacks-public-key';
import { checkLockedDeviceError, useLedgerResponseState } from '../../utils/generic-ledger-utils';
import { ApproveSignLedgerStacksTx } from './steps/approve-sign-stacks-ledger-tx';

export const ledgerStacksTxSigningRoutes = ledgerSignTxRoutes({
  component: <LedgerSignStacksTxContainer />,
  customRoutes: (
    <Route path={RouteUrls.AwaitingDeviceUserAction} element={<ApproveSignLedgerStacksTx />} />
  ),
});

function LedgerSignStacksTxContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const ledgerNavigate = useLedgerNavigate();
  const ledgerAnalytics = useLedgerAnalytics();
  useScrollLock(true);
  const account = useCurrentStacksAccount();
  const canUserCancelAction = useActionCancellableByUser();
  const verifyLedgerPublicKey = useVerifyMatchingLedgerStacksPublicKey();
  const [unsignedTx, setUnsignedTx] = useState<null | string>(null);

  const hasUserSkippedBuggyAppWarning = useMemo(() => createWaitForUserToSeeWarningScreen(), []);

  useEffect(() => {
    const tx = get(location.state, 'tx');
    if (tx) setUnsignedTx(tx);
  }, [location.state]);

  useEffect(() => () => setUnsignedTx(null), []);

  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();

  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);

  const signTransaction = async () => {
    if (!account) return;

    const stacksApp = await prepareLedgerDeviceStacksAppConnection({
      setLoadingState: setAwaitingDeviceConnection,
      onError(e) {
        if (e instanceof Error && checkLockedDeviceError(e)) {
          setLatestDeviceResponse({ deviceLocked: true } as any);
          return;
        }
        ledgerNavigate.toErrorStep();
      },
    });

    try {
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

      ledgerNavigate.toConnectionSuccessStep('stacks');
      await delay(1000);
      if (!unsignedTx) throw new Error('No unsigned tx');

      ledgerNavigate.toAwaitingDeviceOperation({ hasApprovedOperation: false });

      const resp = await signLedgerStacksTransaction(stacksApp)(
        Buffer.from(unsignedTx, 'hex'),
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

      const signedTx = signStacksTransactionWithSignature(unsignedTx, resp.signatureVRS);
      ledgerAnalytics.transactionSignedOnLedgerSuccessfully();

      try {
        appEvents.publish('ledgerStacksTxSigned', {
          unsignedTx,
          signedTx,
        });
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

  function closeAction() {
    appEvents.publish('ledgerStacksTxSigningCancelled', { unsignedTx: unsignedTx ?? '' });
    ledgerNavigate.cancelLedgerAction();
  }

  const ledgerContextValue: LedgerTxSigningContext = {
    chain: 'stacks',
    transaction: unsignedTx ? deserializeTransaction(unsignedTx) : null,
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
        onClose={closeAction}
        pauseOnClickOutside
        waitingOnPerformedActionMessage="Ledger device in use"
      >
        <Outlet />
      </BaseDrawer>
    </LedgerTxSigningProvider>
  );
}
