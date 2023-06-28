import { useMemo } from 'react';

import { LoadingSpinner } from '@app/components/loading-spinner';
import { useBitcoinPendingTransactions } from '@app/query/bitcoin/address/transactions-by-address.hooks';
import { useGetBitcoinTransactionsByAddressQuery } from '@app/query/bitcoin/address/transactions-by-address.query';
import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useStacksPendingTransactions } from '@app/query/stacks/mempool/mempool.hooks';
import { useGetAccountTransactionsWithTransfersQuery } from '@app/query/stacks/transactions/transactions-with-transfers.query';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useSubmittedTransactions } from '@app/store/submitted-transactions/submitted-transactions.selectors';

import { convertBitcoinTxsToListType, convertStacksTxsToListType } from './activity-list.utils';
import { NoAccountActivity } from './components/no-account-activity';
import { PendingTransactionList } from './components/pending-transaction-list/pending-transaction-list';
import { SubmittedTransactionList } from './components/submitted-transaction-list/submitted-transaction-list';
import { TransactionList } from './components/transaction-list/transaction-list';

// TODO: temporary really ugly fix while we address conditional data problem of
// bitcoin sometimes being undefined
function useBitcoinAddress() {
  try {
    return useCurrentAccountNativeSegwitIndexZeroSigner().address;
  } catch (e) {
    return '';
  }
}

export function ActivityList() {
  const bitcoinAddress = useBitcoinAddress();
  const { isInitialLoading: isInitialLoadingBitcoinTransactions, data: bitcoinTransactions } =
    useGetBitcoinTransactionsByAddressQuery(bitcoinAddress);
  const { data: bitcoinPendingTxs = [] } = useBitcoinPendingTransactions(bitcoinAddress);
  const {
    isInitialLoading: isInitialLoadingStacksTransactions,
    data: stacksTransactionsWithTransfers,
  } = useGetAccountTransactionsWithTransfersQuery();
  const {
    query: { isInitialLoading: isInitialLoadingStacksPendingTransactions },
    transactions: stacksPendingTransactions,
  } = useStacksPendingTransactions();
  const submittedTransactions = useSubmittedTransactions();
  const isBitcoinEnabled = useConfigBitcoinEnabled();

  const isInitialLoading =
    isInitialLoadingBitcoinTransactions ||
    isInitialLoadingStacksTransactions ||
    isInitialLoadingStacksPendingTransactions;

  const transactionListBitcoinTxs = useMemo(
    () => convertBitcoinTxsToListType(bitcoinTransactions),
    [bitcoinTransactions]
  );

  const pendingTransactionIds = stacksPendingTransactions.map(tx => tx.tx_id);
  const transactionListStacksTxs = useMemo(
    () =>
      convertStacksTxsToListType(stacksTransactionsWithTransfers?.results).filter(
        ({ transaction }) => !pendingTransactionIds.includes(transaction.tx.tx_id)
      ),
    [stacksTransactionsWithTransfers, pendingTransactionIds]
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
          bitcoinTxs={isBitcoinEnabled ? bitcoinPendingTxs : []}
          stacksTxs={stacksPendingTransactions}
        />
      )}
      {hasTransactions && (
        <TransactionList
          bitcoinTxs={isBitcoinEnabled ? transactionListBitcoinTxs : []}
          stacksTxs={transactionListStacksTxs}
        />
      )}
    </>
  );
}
