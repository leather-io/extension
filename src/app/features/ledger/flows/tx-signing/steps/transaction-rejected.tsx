import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { TransactionRejectedLayout } from '@app/features/ledger/steps/transaction-rejected.layout';

export function LedgerTransactionRejected() {
  const ledgerNavigate = useLedgerNavigate();
  return <TransactionRejectedLayout onClose={() => ledgerNavigate.cancelLedgerAction()} />;
}
