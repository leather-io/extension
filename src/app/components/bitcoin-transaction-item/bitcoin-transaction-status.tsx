import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { PendingLabel } from '@app/components/transaction/pending-label';

interface BitcoinTransactionStatusProps {
  transaction: BitcoinTx;
}
const pendingWaitingMessage =
  'This transaction is waiting to be confirmed. The average (median) confirmation time on Bitcoin is 5-10 minutes';

export function BitcoinTransactionStatus({ transaction }: BitcoinTransactionStatusProps) {
  const isPending = !transaction.status.confirmed;
  return isPending ? <PendingLabel pendingWaitingMessage={pendingWaitingMessage} /> : null;
}
