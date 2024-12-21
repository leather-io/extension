import { useMemo } from 'react';

import { Box } from 'leather-styles/jsx';

import { useTransactionListRender } from './hooks/use-transaction-list-render';
import { TransactionListItem } from './transaction-list-item';
import { TransactionListLayout } from './transaction-list.layout';
import type {
  TransactionListBitcoinTx,
  TransactionListSbtcDeposit,
  TransactionListStacksTx,
} from './transaction-list.model';
import { createTxDateFormatList, getTransactionId } from './transaction-list.utils';
import { TransactionsByDateLayout } from './transactions-by-date.layout';

interface TransactionListProps {
  bitcoinTxs: TransactionListBitcoinTx[];
  stacksTxs: TransactionListStacksTx[];
  sbtcDeposits: TransactionListSbtcDeposit[];
  currentBitcoinAddress: string;
}

export function TransactionList({
  bitcoinTxs,
  stacksTxs,
  sbtcDeposits,
  currentBitcoinAddress,
}: TransactionListProps) {
  const { intersectionSentinel, visibleTxsNum } = useTransactionListRender({
    currentBitcoinAddress,
  });
  const txsGroupedByDate = useMemo(
    () =>
      bitcoinTxs.length || stacksTxs.length || sbtcDeposits.length
        ? createTxDateFormatList(bitcoinTxs, stacksTxs, sbtcDeposits)
        : [],
    [bitcoinTxs, sbtcDeposits, stacksTxs]
  );

  const groupedByDateTxsLength = useMemo(() => {
    return txsGroupedByDate.reduce((acc: Record<string, number>, item, index) => {
      acc[index] = item.txs.length + (acc[index - 1] || 0);
      return acc;
    }, {});
  }, [txsGroupedByDate]);

  return (
    <TransactionListLayout>
      {txsGroupedByDate.map(({ date, displayDate, txs }, dateIndex) => {
        const prevVal = groupedByDateTxsLength[dateIndex - 1] || 0;
        // hide dates with no visible txs
        if (prevVal > visibleTxsNum) {
          return null;
        }

        return (
          <TransactionsByDateLayout date={date} displayDate={displayDate} key={date}>
            {txs.map((tx, txIndex) => {
              // hide txs that are not visible
              if (prevVal + txIndex > visibleTxsNum) return null;
              return <TransactionListItem key={getTransactionId(tx)} tx={tx} />;
            })}
          </TransactionsByDateLayout>
        );
      })}
      <Box ref={intersectionSentinel} />
    </TransactionListLayout>
  );
}
