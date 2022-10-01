import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

import { PendingLabel } from '@app/components/transaction/pending-label';

interface BitcoinTransactionStatusProps {
  transaction: BitcoinTransaction;
}
export function BitcoinTransactionStatus({ transaction }: BitcoinTransactionStatusProps) {
  const isPending = !transaction.status.confirmed;
  return isPending ? <PendingLabel /> : null;
}
