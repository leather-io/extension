import { BitcoinTransaction } from './bitcoin-transaction/bitcoin-transaction';
import { StacksTransaction } from './stacks-transaction/stacks-transaction';
import { TransactionListTxs } from './transaction-list.model';

interface TransactionListItemProps {
  tx: TransactionListTxs;
}
export function TransactionListItem({ tx }: TransactionListItemProps) {
  switch (tx.blockchain) {
    case 'bitcoin':
      return <BitcoinTransaction transaction={tx.transaction} />;
    case 'stacks':
      return <StacksTransaction transaction={tx.transaction} />;
    default:
      return null;
  }
}
