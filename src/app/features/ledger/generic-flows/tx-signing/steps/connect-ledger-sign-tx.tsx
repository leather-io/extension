import { CommonLedgerDeviceInlineWarnings } from '@app/features/ledger/components/ledger-inline-warnings';
import { ConnectLedger } from '@app/features/ledger/generic-steps';
import { useWhenReattemptingLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';

import { useLedgerTxSigningContext } from '../ledger-sign-tx.context';

export function ConnectLedgerSignTx() {
  const { chain, signTransaction, latestDeviceResponse, awaitingDeviceConnection } =
    useLedgerTxSigningContext();

  useWhenReattemptingLedgerConnection(() => signTransaction());

  return (
    <ConnectLedger
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
