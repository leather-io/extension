import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { PublicKeyMismatchLayout } from '@app/features/ledger/steps/public-key-mismatch.layout';

export function LedgerPublicKeyMismatch() {
  const ledgerNavigate = useLedgerNavigate();
  return (
    <PublicKeyMismatchLayout
      onClose={() => ledgerNavigate.cancelLedgerAction()}
      onTryAgain={() => ledgerNavigate.toConnectStepAndTryAgain()}
    />
  );
}
