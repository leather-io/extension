import { useMemo } from 'react';

import { TransactionsByDateLayout } from './transactions-by-date.layout';
import { TransactionListLayout } from './transaction-list.layout';
import { createTxDateFormatList, getTransactionId } from './transaction-list.utils';
import { TransactionListItem } from './transaction-list-item';
import { TransactionListBitcoinTx, TransactionListStacksTx } from './transaction-list.model';

interface TransactionListProps {
  bitcoinTxs: TransactionListBitcoinTx[];
  stacksTxs: TransactionListStacksTx[];
}
export function TransactionList({ bitcoinTxs, stacksTxs }: TransactionListProps) {
  const txsGroupedByDate = useMemo(
    () =>
      bitcoinTxs.length || stacksTxs.length ? createTxDateFormatList(bitcoinTxs, stacksTxs) : [],
    [bitcoinTxs, stacksTxs]
  );

  return (
    <TransactionListLayout>
      {txsGroupedByDate.map(({ date, displayDate, txs }) => (
        <TransactionsByDateLayout date={date} displayDate={displayDate} key={date}>
          {txs.map(tx => (
            <TransactionListItem key={getTransactionId(tx)} tx={tx} />
          ))}
        </TransactionsByDateLayout>
      ))}
    </TransactionListLayout>
  );
}
