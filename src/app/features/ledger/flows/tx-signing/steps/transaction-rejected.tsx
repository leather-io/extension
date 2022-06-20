import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { LedgerOperationRejectedLayout } from '@app/features/ledger/steps/transaction-rejected.layout';

export function LedgerTransactionRejected() {
  const ledgerNavigate = useLedgerNavigate();
  return (
    <LedgerOperationRejectedLayout
      description="The transaction on your Ledger was rejected"
      onClose={() => ledgerNavigate.cancelLedgerAction()}
    />
  );
}
