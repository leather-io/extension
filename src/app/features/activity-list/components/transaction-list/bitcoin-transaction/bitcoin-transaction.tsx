import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { BitcoinTransactionItem } from '@app/components/bitcoin-transaction-item/bitcoin-transaction-item';

interface BitcoinTransactionProps {
  transaction?: BitcoinTx;
}

export function BitcoinTransaction({ transaction }: BitcoinTransactionProps) {
  return <BitcoinTransactionItem transaction={transaction} />;
}
