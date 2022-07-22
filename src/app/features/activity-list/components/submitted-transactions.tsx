import { SubmittedTransaction } from '@app/store/submitted-transactions/submitted-transactions.slice';

import {
  SubmittedTransactionsListItem,
  SubmittedTransactionsListLayout,
} from './submitted-transactions-list.layout';

interface SubmittedTransactionProps {
  txs: SubmittedTransaction[];
}
export function SubmittedTransactions({ txs }: SubmittedTransactionProps) {
  return (
    <SubmittedTransactionsListLayout>
      {txs.map(tx => {
        if (!tx) return null;
        return <SubmittedTransactionsListItem key={tx.txId} rawTx={tx.rawTx} txId={tx.txId} />;
      })}
    </SubmittedTransactionsListLayout>
  );
}
