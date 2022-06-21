import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StacksTransaction } from '@stacks/transactions';

import { RouteUrls } from '@shared/route-urls';
import { immediatelyAttemptLedgerConnection } from './use-when-reattempt-ledger-connection';

export function useLedgerNavigate() {
  const navigate = useNavigate();

  return useMemo(
    () => ({
      toConnectStep() {
        return navigate(RouteUrls.ConnectLedger, { replace: true });
      },

      toConnectStepAndTryAgain() {
        return navigate(`../${RouteUrls.ConnectLedger}`, {
          replace: true,
          state: { [immediatelyAttemptLedgerConnection]: true },
        });
      },

      toConnectAndSignStep(transaction: StacksTransaction, goBack?: boolean) {
        return navigate(RouteUrls.ConnectLedger, {
          replace: !goBack,
          state: { goBack, tx: transaction.serialize().toString('hex') },
        });
      },

      toActivityHappeningOnDeviceStep() {
        return navigate(RouteUrls.DeviceBusy, { replace: true });
      },

      toConnectionSuccessStep() {
        return navigate(RouteUrls.ConnectLedgerSuccess, { replace: true });
      },

      toErrorStep(errorMessage?: string) {
        return navigate(RouteUrls.ConnectLedgerError, {
          replace: true,
          state: { latestLedgerError: errorMessage },
        });
      },

      toAwaitingDeviceOperation({ hasApprovedOperation }: { hasApprovedOperation: boolean }) {
        return navigate(RouteUrls.AwaitingDeviceUserAction, {
          replace: true,
          state: { hasApprovedOperation },
        });
      },

      toPublicKeyMismatchStep() {
        return navigate(RouteUrls.LedgerPublicKeyMismatch, { replace: true });
      },

      toTransactionRejectedStep() {
        return navigate(RouteUrls.LedgerOperationRejected, { replace: true });
      },

      toDeviceDisconnectStep() {
        return navigate(RouteUrls.LedgerDisconnected, { replace: true });
      },

      // TODO: Do we need to cancel the tx signing request here bc it still
      // stays active on the ledger to approve/reject
      cancelLedgerAction() {
        return navigate('..');
      },

      cancelLedgerActionAndReturnHome() {
        return navigate(RouteUrls.Home);
      },
    }),

    [navigate]
  );
}
