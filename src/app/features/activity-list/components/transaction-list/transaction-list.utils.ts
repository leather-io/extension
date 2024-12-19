import dayjs from 'dayjs';

import { isUndefined } from '@leather.io/utils';

import { displayDate, isoDateToLocalDateSafe, todaysIsoDate } from '@app/common/date-utils';
import type {
  TransactionListBitcoinTx,
  TransactionListSbtcDeposit,
  TransactionListStacksTx,
  TransactionListTxs,
} from '@app/features/activity-list/components/transaction-list/transaction-list.model';

export function getTransactionId(listTx: TransactionListTxs) {
  switch (listTx.blockchain) {
    case 'bitcoin':
      return listTx.transaction.txid;
    case 'stacks':
      return listTx.transaction.tx.tx_id;
    default:
      return undefined;
  }
}

function getTransactionTime(listTx: TransactionListTxs) {
  switch (listTx.blockchain) {
    case 'bitcoin':
      if (!listTx.transaction.status.block_time) return;
      return dayjs.unix(listTx.transaction.status.block_time).format();
    case 'stacks':
      return (
        listTx.transaction.tx.burn_block_time_iso ||
        listTx.transaction.tx.parent_burn_block_time_iso
      );
    case 'bitcoin-stacks':
      return listTx.deposit.block?.burn_block_time_iso;
    default:
      return undefined;
  }
}

function getTransactionTxIndex(listTx: TransactionListTxs) {
  switch (listTx.blockchain) {
    case 'stacks':
      return listTx.transaction.tx.tx_index;
    default:
      return undefined;
  }
}

function getTransactionBlockHeight(listTx: TransactionListTxs) {
  switch (listTx.blockchain) {
    case 'bitcoin':
      if (!listTx.transaction.status.block_height) return;
      return listTx.transaction.status.block_height;
    case 'stacks':
      return listTx.transaction.tx.block_height;
    case 'bitcoin-stacks':
      return listTx.deposit.block?.height ?? listTx.deposit.lastUpdateHeight;
    default:
      return undefined;
  }
}

function groupTxsByDateMap(txs: TransactionListTxs[]) {
  return txs
    .sort((a, b) => {
      const aTxIndex = getTransactionTxIndex(a);
      const bTxIndex = getTransactionTxIndex(b);

      if (!aTxIndex || !bTxIndex) return 0;
      return aTxIndex > bTxIndex ? -1 : aTxIndex < bTxIndex ? 1 : 0;
    })
    .sort((a, b) => {
      const aBlockHeight = getTransactionBlockHeight(a);
      const bBlockHeight = getTransactionBlockHeight(b);

      if (!aBlockHeight || !bBlockHeight) return 0;
      return aBlockHeight > bBlockHeight ? -1 : aBlockHeight < bBlockHeight ? 1 : 0;
    })
    .sort((a, b) => {
      const aTime = getTransactionTime(a);
      const bTime = getTransactionTime(b);

      if (!aTime || !bTime) return 0;

      const aMsTime = new Date(aTime).getTime();
      const bMsTime = new Date(bTime).getTime();

      return aMsTime > bMsTime ? -1 : aMsTime < bMsTime ? 1 : 0;
    })
    .reduce((txsByDate, tx) => {
      const time = getTransactionTime(tx);
      const date = time ? isoDateToLocalDateSafe(time) : undefined;
      if (isUndefined(date)) {
        const today = todaysIsoDate();
        txsByDate.set(today, [...(txsByDate.get(today) || []), tx]);
      } else {
        if (!txsByDate.has(date)) {
          txsByDate.set(date, []);
        }
        txsByDate.set(date, [...(txsByDate.get(date) || []), tx]);
      }
      return txsByDate;
    }, new Map<string, TransactionListTxs[]>());
}

function formatTxDateMapAsList(txMap: Map<string, TransactionListTxs[]>) {
  return [...txMap.keys()].map(date => ({
    date,
    displayDate: displayDate(date),
    txs: txMap.get(date) ?? [],
  }));
}

function countTxIds(txs: TransactionListStacksTx[]) {
  return txs.reduce((acc, stacksTx) => {
    return acc.set(
      stacksTx.transaction.tx.tx_id,
      (acc.get(stacksTx.transaction.tx.tx_id) || 0) + 1
    );
  }, new Map());
}

function filterDuplicateStacksTxs(txs: TransactionListStacksTx[]) {
  const countOfTxIds = countTxIds(txs);

  return txs.filter(stacksTx => {
    const isDropped = stacksTx.transaction.tx.tx_status.includes('dropped');
    if (countOfTxIds.get(stacksTx.transaction.tx.tx_id) === 1 && !isDropped) return true;
    return (
      stacksTx.transaction.tx.tx_status === 'success' ||
      stacksTx.transaction.tx.tx_status.includes('abort')
    );
  });
}

function sortGroupedTransactions(
  txs: {
    date: string;
    displayDate: string;
    txs: TransactionListTxs[];
  }[]
) {
  return txs.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
}

export function createTxDateFormatList(
  bitcoinTxs: TransactionListBitcoinTx[],
  stacksTxs: TransactionListStacksTx[],
  sbtcDeposits: TransactionListSbtcDeposit[]
) {
  const formattedTxs = formatTxDateMapAsList(
    groupTxsByDateMap([...bitcoinTxs, ...filterDuplicateStacksTxs(stacksTxs), ...sbtcDeposits])
  );
  return sortGroupedTransactions(formattedTxs);
}
