import { CommonLedgerDeviceInlineWarnings } from '@app/features/ledger/components/ledger-inline-warnings';
import { ConnectLedgerLayout } from '@app/features/ledger/generic-steps/connect-device/connect-ledger.layout';
import { useWhenReattemptingLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';

import { useLedgerTxSigningContext } from '../ledger-sign-tx.context';

export function ConnectLedgerSignTx() {
  const { signTransaction, latestDeviceResponse, awaitingDeviceConnection } =
    useLedgerTxSigningContext();

  useWhenReattemptingLedgerConnection(() => signTransaction());

  return (
    <ConnectLedgerLayout
      chain="stacks"
      awaitingLedgerConnection={awaitingDeviceConnection}
      warning={
        <CommonLedgerDeviceInlineWarnings
          chain="stacks"
          latestDeviceResponse={latestDeviceResponse}
        />
      }
      onConnectLedger={signTransaction}
      showInstructions={false}
    />
  );
}
