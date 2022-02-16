import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { LedgerDisconnectedLayout } from '@app/features/ledger/steps/ledger-disconnected.layout';

export function LedgerDisconnected() {
  const ledgerNavigate = useLedgerNavigate();
  return (
    <LedgerDisconnectedLayout
      onClose={() => ledgerNavigate.cancelLedgerAction()}
      onConnectAgain={() => ledgerNavigate.toConnectStepAndTryAgain()}
    />
  );
}
