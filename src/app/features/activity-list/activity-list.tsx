import { useMemo } from 'react';

import { BITCOIN_TEST_ADDRESS } from '@shared/constants';

import { LoadingSpinner } from '@app/components/loading-spinner';
import { useGetBitcoinTransactionsByAddressQuery } from '@app/query/bitcoin/address/transactions-by-address.query';
import { useStacksPendingTransactions } from '@app/query/stacks/mempool/mempool.hooks';
import { useGetAccountTransactionsWithTransfersQuery } from '@app/query/stacks/transactions/transactions-with-transfers.query';
import { useSubmittedTransactions } from '@app/store/submitted-transactions/submitted-transactions.selectors';

import { convertBitcoinTxsToListType, convertStacksTxsToListType } from './activity-list.utils';
import { NoAccountActivity } from './components/no-account-activity';
import { PendingTransactionList } from './components/pending-transaction-list/pending-transaction-list';
import { SubmittedTransactionList } from './components/submitted-transaction-list/submitted-transaction-list';
import { TransactionList } from './components/transaction-list/transaction-list';

export const ActivityList = () => {
  const { isInitialLoading: isInitialLoadingBitcoinTransactions, data: bitcoinTransactions } =
    useGetBitcoinTransactionsByAddressQuery(BITCOIN_TEST_ADDRESS);
  const {
    isInitialLoading: isInitialLoadingStacksTransactions,
    data: stacksTransactionsWithTransfers,
  } = useGetAccountTransactionsWithTransfersQuery();
  const {
    query: { isInitialLoading: isInitialLoadingStacksPendingTransactions },
    transactions: stacksPendingTransactions,
  } = useStacksPendingTransactions();
  const submittedTransactions = useSubmittedTransactions();

  const isInitialLoading =
    isInitialLoadingBitcoinTransactions ||
    isInitialLoadingStacksTransactions ||
    isInitialLoadingStacksPendingTransactions;

  const bitcoinPendingTxs = useMemo(
    () => (bitcoinTransactions ?? []).filter(tx => !tx.status.confirmed),
    [bitcoinTransactions]
  );
  const transactionListBitcoinTxs = useMemo(
    () => convertBitcoinTxsToListType(bitcoinTransactions),
    [bitcoinTransactions]
  );

  const transactionListStacksTxs = useMemo(
    () => convertStacksTxsToListType(stacksTransactionsWithTransfers?.results),
    [stacksTransactionsWithTransfers]
  );

  const hasSubmittedTransactions = submittedTransactions.length > 0;
  const hasPendingTransactions =
    bitcoinPendingTxs.length > 0 || stacksPendingTransactions.length > 0;
  const hasTransactions =
    transactionListBitcoinTxs.length > 0 || transactionListStacksTxs.length > 0;

  const hasTxs = hasSubmittedTransactions || hasPendingTransactions || hasTransactions;

  if (isInitialLoading) return <LoadingSpinner />;

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
