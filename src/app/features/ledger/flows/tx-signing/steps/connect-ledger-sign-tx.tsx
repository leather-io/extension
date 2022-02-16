import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import get from 'lodash.get';

import { ConnectLedgerLayout } from '@app/features/ledger/steps/connect-ledger.layout';
import { useWhenReattemptingLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';

import { ledgerTxSigningContext } from '@app/features/ledger/ledger-tx-signing.context';
import { LedgerInlineWarnings } from '@app/features/ledger/components/ledger-inline-warnings';

export function ConnectLedgerSignTx() {
  const location = useLocation();

  const { signTransaction, latestDeviceResponse, awaitingDeviceConnection } =
    useContext(ledgerTxSigningContext);

  const isLookingForLedger = get(location, 'state.isLookingForLedger');

  useWhenReattemptingLedgerConnection(() => signTransaction());

  return (
    <ConnectLedgerLayout
      awaitingLedgerConnection={awaitingDeviceConnection}
      isLookingForLedger={isLookingForLedger}
      warning={<LedgerInlineWarnings latestDeviceResponse={latestDeviceResponse} />}
      onConnectLedger={signTransaction}
      showInstructions={false}
    />
  );
}
