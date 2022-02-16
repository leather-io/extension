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

      toConnectAndSignStep(transaction: StacksTransaction) {
        return navigate(RouteUrls.ConnectLedger, {
          replace: true,
          state: { tx: transaction.serialize().toString('hex') },
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

      toSignTransactionStep({ hasApprovedTransaction }: { hasApprovedTransaction: boolean }) {
        return navigate(RouteUrls.SignLedgerTransaction, {
          replace: true,
          state: { hasApprovedTransaction },
        });
      },

      toPublicKeyMismatchStep() {
        return navigate(RouteUrls.LedgerPublicKeyMismatch, { replace: true });
      },

      toTransactionRejectedStep() {
        return navigate(RouteUrls.TransactionRejected, { replace: true });
      },

      toDeviceDisconnectStep() {
        return navigate(RouteUrls.LedgerDisconnected, { replace: true });
      },

      cancelLedgerAction() {
        return navigate('..');
      },
    }),

    [navigate]
  );
}
