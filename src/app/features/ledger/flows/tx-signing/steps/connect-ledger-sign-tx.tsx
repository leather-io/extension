import { useContext } from 'react';

import { ConnectLedgerLayout } from '@app/features/ledger/generic-steps/connect-device/connect-ledger.layout';
import { useWhenReattemptingLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';

import { ledgerTxSigningContext } from '@app/features/ledger/flows/tx-signing/ledger-sign-tx.context';
import { CommonLedgerDeviceInlineWarnings } from '@app/features/ledger/components/ledger-inline-warnings';

export function ConnectLedgerSignTx() {
  const { signTransaction, latestDeviceResponse, awaitingDeviceConnection } =
    useContext(ledgerTxSigningContext);

  useWhenReattemptingLedgerConnection(() => signTransaction());

  return (
    <ConnectLedgerLayout
      awaitingLedgerConnection={awaitingDeviceConnection}
      warning={<CommonLedgerDeviceInlineWarnings latestDeviceResponse={latestDeviceResponse} />}
      onConnectLedger={signTransaction}
      showInstructions={false}
    />
  );
}
