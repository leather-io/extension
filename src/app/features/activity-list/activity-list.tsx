import { useMemo } from 'react';

import { useGetAccountTransactionsWithTransfersQuery } from '@app/query/stacks/transactions/transactions-with-transfers.query';
import { useGetBitcoinTransactionsByAddressQuery } from '@app/query/bitcoin/address/transactions-by-address.query';
import { useStacksPendingTransactions } from '@app/query/stacks/mempool/mempool.hooks';
import { useSubmittedTransactions } from '@app/store/submitted-transactions/submitted-transactions.selectors';
import { BITCOIN_TEST_ADDRESS } from '@shared/constants';

import { NoAccountActivity } from './components/no-account-activity';
import { SubmittedTransactionList } from './components/submitted-transaction-list/submitted-transaction-list';
import { TransactionList } from './components/transaction-list/transaction-list';
import { PendingTransactionList } from './components/pending-transaction-list/pending-transaction-list';
import { convertBitcoinTxsToListType, convertStacksTxsToListType } from './activity-list.utils';

export const ActivityList = () => {
  const bitcoinTransactions = useGetBitcoinTransactionsByAddressQuery(BITCOIN_TEST_ADDRESS).data;
  const stacksTransactionsWithTransfers =
    useGetAccountTransactionsWithTransfersQuery().data?.results;
  const stacksPendingTransactions = useStacksPendingTransactions();
  const submittedTransactions = useSubmittedTransactions();

  const bitcoinPendingTxs = useMemo(
    () => (bitcoinTransactions ?? []).filter(tx => !tx.status.confirmed),
    [bitcoinTransactions]
  );
  const transactionListBitcoinTxs = useMemo(
    () => convertBitcoinTxsToListType(bitcoinTransactions),
    [bitcoinTransactions]
  );
  const transactionListStacksTxs = useMemo(
    () => convertStacksTxsToListType(stacksTransactionsWithTransfers),
    [stacksTransactionsWithTransfers]
  );

  const hasSubmittedTransactions = submittedTransactions.length > 0;
  const hasPendingTransactions =
    bitcoinPendingTxs.length > 0 || stacksPendingTransactions.length > 0;
  const hasTransactions =
    transactionListBitcoinTxs.length > 0 || transactionListStacksTxs.length > 0;

  const hasTxs = hasSubmittedTransactions || hasPendingTransactions || hasTransactions;

  if (!hasTxs) return <NoAccountActivity />;

  return (
    <>
      {hasSubmittedTransactions && <SubmittedTransactionList txs={submittedTransactions} />}
      {hasPendingTransactions && (
        <PendingTransactionList
          bitcoinTxs={bitcoinPendingTxs}
          stacksTxs={stacksPendingTransactions}
        />
      )}
      {hasTransactions && (
        <TransactionList
          bitcoinTxs={transactionListBitcoinTxs}
          stacksTxs={transactionListStacksTxs}
        />
      )}
    </>
  );
};
