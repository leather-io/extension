import { BitcoinTransactionItem } from '@app/features/activity-list/components/transaction-list/bitcoin-transaction/bitcoin-transaction-item';
import { WalletBlockchains } from '@shared/models/blockchain.model';

import { StacksTransaction } from './stacks-transaction/stacks-transaction';
import { TransactionListTxs } from './transaction-list.model';

function renderTransaction(tx: TransactionListTxs) {
  switch (tx.blockchain) {
    case WalletBlockchains.bitcoin:
      return <BitcoinTransactionItem transaction={tx.transaction} />;
    case WalletBlockchains.stacks:
      return <StacksTransaction transaction={tx.transaction} />;
    default:
      return null;
  }
}

interface TransactionListItemProps {
  tx: TransactionListTxs;
}
export function TransactionListItem({ tx }: TransactionListItemProps) {
  return renderTransaction(tx);
}
