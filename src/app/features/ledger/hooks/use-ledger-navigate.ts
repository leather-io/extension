import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StacksTransaction } from '@stacks/transactions';

import { RouteUrls } from '@shared/route-urls';
import { immediatelyAttemptLedgerConnection } from './use-when-reattempt-ledger-connection';
import { bytesToHex } from '@stacks/common';

export function useLedgerNavigate() {
  const navigate = useNavigate();

  return useMemo(
    () => ({
      toConnectStepAndTryAgain() {
        return navigate(`../${RouteUrls.ConnectLedger}`, {
          replace: true,
          state: { [immediatelyAttemptLedgerConnection]: true },
        });
      },

      toConnectAndSignTransactionStep(transaction: StacksTransaction, goBack?: boolean) {
        return navigate(RouteUrls.ConnectLedger, {
          replace: !goBack,
          state: { goBack, tx: bytesToHex(transaction.serialize()) },
        });
      },

      toConnectAndSignMessageStep(message: string, goBack?: boolean) {
        return navigate(RouteUrls.ConnectLedger, {
          replace: !goBack,
          state: { goBack, message },
        });
      },

      toDeviceBusyStep(description?: string) {
        return navigate(RouteUrls.DeviceBusy, { replace: true, state: { description } });
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

      toDevicePayloadInvalid() {
        return navigate(RouteUrls.LedgerDevicePayloadInvalid, { replace: true });
      },

      toOperationRejectedStep(description?: string) {
        return navigate(RouteUrls.LedgerOperationRejected, {
          replace: true,
          state: { description },
        });
      },

      toDeviceDisconnectStep() {
        return navigate(RouteUrls.LedgerDisconnected, { replace: true });
      },

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
