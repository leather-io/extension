import { useEffect, useMemo } from 'react';
import { Outlet } from 'react-router-dom';

import uniqby from 'lodash.uniqby';

import {
  useBitcoinPendingTransactions,
  useGetAccountTransactionsWithTransfersQuery,
  useGetBitcoinTransactionsByAddressListQuery,
  useStacksPendingTransactions,
} from '@leather.io/query';

import { LoadingSpinner } from '@app/components/loading-spinner';
import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';
import {
  useSbtcConfirmedDeposits,
  useSbtcFailedDeposits,
  useSbtcPendingDeposits,
} from '@app/query/sbtc/sbtc-deposits.query';
import { useZeroIndexTaprootAddress } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useUpdateSubmittedTransactions } from '@app/store/submitted-transactions/submitted-transactions.hooks';
import { useSubmittedTransactions } from '@app/store/submitted-transactions/submitted-transactions.selectors';

import {
  convertBitcoinTxsToListType,
  convertSbtcDepositToListType,
  convertStacksTxsToListType,
} from './activity-list.utils';
import { NoAccountActivity } from './components/no-account-activity';
import { PendingTransactionList } from './components/pending-transaction-list/pending-transaction-list';
import { SubmittedTransactionList } from './components/submitted-transaction-list/submitted-transaction-list';
import { ActivityListTabWrapper } from './components/tab-wrapper';
import { TransactionList } from './components/transaction-list/transaction-list';

// TODO: temporary really ugly fix while we address conditional data problem of
// bitcoin sometimes being undefined
function useNsBitcoinAddress() {
  try {
    return useCurrentAccountNativeSegwitIndexZeroSigner().address;
  } catch (e) {
    return '';
  }
}

function useTrBitcoinAddress() {
  try {
    return useZeroIndexTaprootAddress();
  } catch (e) {
    return '';
  }
}

export function ActivityList() {
  const nsBitcoinAddress = useNsBitcoinAddress();
  const trBitcoinAddress = useTrBitcoinAddress();
  const stxAddress = useCurrentStacksAccountAddress();
  const updateSubmittedTxs = useUpdateSubmittedTransactions();

  const [
    { isLoading: isLoadingNsBitcoinTransactions, data: nsBitcoinTransactions = [] },
    { isLoading: isLoadingTrBitcoinTransactions, data: trBitcoinTransactions = [] },
  ] = useGetBitcoinTransactionsByAddressListQuery([nsBitcoinAddress, trBitcoinAddress]);

  const [{ data: nsPendingTxs = [] }, { data: trPendingTxs = [] }] = useBitcoinPendingTransactions([
    nsBitcoinAddress,
    trBitcoinAddress,
  ]);
  const bitcoinPendingTxs = useMemo(
    () => uniqby([...nsPendingTxs, ...trPendingTxs], 'txid'),
    [nsPendingTxs, trPendingTxs]
  );

  const { isLoading: isLoadingSbtcPendingDeposits, pendingSbtcDeposits } =
    useSbtcPendingDeposits(stxAddress);
  const { isLoading: isLoadingSbtcConfirmedDeposits, confirmedSbtcDeposits } =
    useSbtcConfirmedDeposits(stxAddress);
  const { isLoading: isLoadingSbtcFailedDeposits, failedSbtcDeposits } =
    useSbtcFailedDeposits(stxAddress);

  const { isLoading: isLoadingStacksTransactions, data: stacksTransactionsWithTransfers } =
    useGetAccountTransactionsWithTransfersQuery(stxAddress);
  const {
    query: { isLoading: isLoadingStacksPendingTransactions },
    transactions: stacksPendingTransactions,
  } = useStacksPendingTransactions(stxAddress);
  const submittedTransactions = useSubmittedTransactions();
  const isBitcoinEnabled = useConfigBitcoinEnabled();

  useEffect(() => {
    updateSubmittedTxs(stacksPendingTransactions);
  }, [stacksPendingTransactions, updateSubmittedTxs]);

  const isLoading =
    isLoadingNsBitcoinTransactions ||
    isLoadingTrBitcoinTransactions ||
    isLoadingStacksTransactions ||
    isLoadingStacksPendingTransactions ||
    isLoadingSbtcPendingDeposits ||
    isLoadingSbtcConfirmedDeposits ||
    isLoadingSbtcFailedDeposits;

  const transactionListBitcoinTxs = useMemo(() => {
    return convertBitcoinTxsToListType(
      uniqby([...nsBitcoinTransactions, ...trBitcoinTransactions], 'txid')
    );
  }, [nsBitcoinTransactions, trBitcoinTransactions]);

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
    bitcoinPendingTxs.length > 0 ||
    stacksPendingTransactions.length > 0 ||
    pendingSbtcDeposits.length > 0;
  const hasTransactions =
    transactionListBitcoinTxs.length > 0 || transactionListStacksTxs.length > 0;

  const hasTxs = hasSubmittedTransactions || hasPendingTransactions || hasTransactions;

  if (isLoading)
    return (
      <ActivityListTabWrapper padContent>
        <LoadingSpinner />
        <Outlet />
      </ActivityListTabWrapper>
    );

  if (!hasTxs)
    return (
      <ActivityListTabWrapper padContent>
        <NoAccountActivity />
        <Outlet />
      </ActivityListTabWrapper>
    );

  return (
    <>
      <ActivityListTabWrapper>
        {hasSubmittedTransactions && <SubmittedTransactionList txs={submittedTransactions} />}
        {hasPendingTransactions && (
          <PendingTransactionList
            bitcoinTxs={isBitcoinEnabled ? bitcoinPendingTxs : []}
            sbtcDeposits={pendingSbtcDeposits}
            stacksTxs={stacksPendingTransactions}
          />
        )}
        {hasTransactions && (
          <TransactionList
            bitcoinTxs={isBitcoinEnabled ? transactionListBitcoinTxs : []}
            stacksTxs={transactionListStacksTxs}
            sbtcDeposits={convertSbtcDepositToListType([
              ...confirmedSbtcDeposits,
              ...failedSbtcDeposits,
            ])}
            currentBitcoinAddress={nsBitcoinAddress}
          />
        )}
      </ActivityListTabWrapper>
      <Outlet />
    </>
  );
}
