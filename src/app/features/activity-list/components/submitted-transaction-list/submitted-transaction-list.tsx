import { SubmittedTransaction } from '@app/store/submitted-transactions/submitted-transactions.slice';

import {
  SubmittedTransactionListItem,
  SubmittedTransactionListLayout,
} from './submitted-transaction-list.layout';

interface SubmittedTransactionListProps {
  txs: SubmittedTransaction[];
}
export function SubmittedTransactionList({ txs }: SubmittedTransactionListProps) {
  return (
    <SubmittedTransactionListLayout>
      {txs.map(tx => {
        if (!tx) return null;
        return <SubmittedTransactionListItem key={tx.txid} rawTx={tx.rawTx} txid={tx.txid} />;
      })}
    </SubmittedTransactionListLayout>
  );
}
