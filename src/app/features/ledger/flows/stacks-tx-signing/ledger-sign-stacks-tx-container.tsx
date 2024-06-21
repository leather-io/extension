import { useEffect, useState } from 'react';
import { Route, useLocation, useNavigate } from 'react-router-dom';

import { deserializeTransaction } from '@stacks/transactions';
import StacksApp, { LedgerError } from '@zondax/ledger-stacks';
import get from 'lodash.get';

import { delay, isError } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { useScrollLock } from '@app/common/hooks/use-scroll-lock';
import { appEvents } from '@app/common/publish-subscribe';
import { LedgerTxSigningContext } from '@app/features/ledger/generic-flows/tx-signing/ledger-sign-tx.context';
import { useCancelLedgerAction } from '@app/features/ledger/utils/generic-ledger-utils';
import {
  connectLedgerStacksApp,
  getStacksAppVersion,
  isStacksAppOpen,
  isVersionOfLedgerStacksAppWithContractPrincipalBug,
  signLedgerStacksTransaction,
  signStacksTransactionWithSignature,
} from '@app/features/ledger/utils/stacks-ledger-utils';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { ledgerSignTxRoutes } from '../../generic-flows/tx-signing/ledger-sign-tx-route-generator';
import { TxSigningFlow } from '../../generic-flows/tx-signing/tx-signing-flow';
import { useLedgerSignTx } from '../../generic-flows/tx-signing/use-ledger-sign-tx';
import { useLedgerAnalytics } from '../../hooks/use-ledger-analytics.hook';
import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { useVerifyMatchingLedgerStacksPublicKey } from '../../hooks/use-verify-matching-stacks-public-key';
import { ApproveSignLedgerStacksTx } from './steps/approve-sign-stacks-ledger-tx';

export const ledgerStacksTxSigningRoutes = ledgerSignTxRoutes({
  component: <LedgerSignStacksTxContainer />,
  customRoutes: (
    <Route path={RouteUrls.AwaitingDeviceUserAction} element={<ApproveSignLedgerStacksTx />} />
  ),
});

function LedgerSignStacksTxContainer() {
  const location = useLocation();
  const ledgerNavigate = useLedgerNavigate();
  const ledgerAnalytics = useLedgerAnalytics();
  useScrollLock(true);
  const account = useCurrentStacksAccount();
  const verifyLedgerPublicKey = useVerifyMatchingLedgerStacksPublicKey();
  const [unsignedTx, setUnsignedTx] = useState<null | string>(null);
  const navigate = useNavigate();

  const chain = 'stacks' as const;

  useEffect(() => {
    const tx = get(location.state, 'tx');
    if (tx) setUnsignedTx(tx);
  }, [location.state]);

  useEffect(() => () => setUnsignedTx(null), []);

  const {
    signTransaction,
    latestDeviceResponse,
    awaitingDeviceConnection,
    hasUserSkippedBuggyAppWarning,
  } = useLedgerSignTx<StacksApp>({
    chain,
    isAppOpen: isStacksAppOpen,
    getAppVersion: getStacksAppVersion,
    connectApp: connectLedgerStacksApp,
    async passesAdditionalVersionCheck(appVersion) {
      if (appVersion.chain !== 'stacks') {
        return true;
      }

      if (isVersionOfLedgerStacksAppWithContractPrincipalBug(appVersion)) {
        navigate(RouteUrls.LedgerOutdatedAppWarning);
        const response = await hasUserSkippedBuggyAppWarning.wait();

        if (response === 'cancelled-operation') {
          ledgerNavigate.cancelLedgerAction();
        }
        return false;
      }
      return true;
    },
    async signTransactionWithDevice(stacksApp) {
      // TODO: need better handling
      if (!account) return;

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
        const error = isError(e) ? e.message : 'Unknown error';
        void analytics.track('ledger_transaction_publish_error', {
          error: {
            message: error,
            error: e,
          },
        });

        ledgerNavigate.toBroadcastErrorStep(error);
        return;
      }
    },
  });

  function closeAction() {
    appEvents.publish('ledgerStacksTxSigningCancelled', { unsignedTx: unsignedTx ?? '' });
    ledgerNavigate.cancelLedgerAction();
  }

  const ledgerContextValue: LedgerTxSigningContext = {
    chain,
    transaction: unsignedTx ? deserializeTransaction(unsignedTx) : null,
    signTransaction,
    latestDeviceResponse,
    awaitingDeviceConnection,
    hasUserSkippedBuggyAppWarning,
  };
  const canCancelLedgerAction = useCancelLedgerAction(awaitingDeviceConnection);

  return (
    <TxSigningFlow
      context={ledgerContextValue}
      closeAction={canCancelLedgerAction ? closeAction : undefined}
    />
  );
}
