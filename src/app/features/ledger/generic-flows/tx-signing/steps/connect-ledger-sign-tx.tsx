import { CommonLedgerDeviceInlineWarnings } from '@app/features/ledger/components/ledger-inline-warnings';
import { ConnectLedgerLayout } from '@app/features/ledger/generic-steps/connect-device/connect-ledger.layout';
import { useWhenReattemptingLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';

import { useLedgerTxSigningContext } from '../ledger-sign-tx.context';

export function ConnectLedgerSignTx() {
  const { chain, signTransaction, latestDeviceResponse, awaitingDeviceConnection } =
    useLedgerTxSigningContext();

  console.log('rendering ConnectLedgerSignTx');

  useWhenReattemptingLedgerConnection(() => signTransaction());

  return (
    <ConnectLedgerLayout
      chain={chain}
      awaitingLedgerConnection={awaitingDeviceConnection}
      warning={
        <CommonLedgerDeviceInlineWarnings
          chain={chain}
          latestDeviceResponse={latestDeviceResponse}
        />
      }
      onConnectLedger={signTransaction}
      showInstructions={false}
    />
  );
}
