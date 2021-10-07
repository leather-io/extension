import React from 'react';

import {
  useCurrentAccountLocallySubmittedStacksTransactions,
  useCurrentAccountLocalTxids,
} from '@store/accounts/account-activity.hooks';
import { TransactionList } from '@components/popup/transaction-list';
import { LocalTxList } from '@features/local-transaction-activity/local-tx-list';

import { NoAccountActivity } from './components/no-account-activity';
import { useAccountTransactionsWithTransfers } from '@common/hooks/account/use-account-transactions-with-transfers.hooks';
import { useCurrentAccountFilteredMempoolTransactionsState } from '@query/mempool/mempool.hooks';
import { useTrackChangedTransactions } from '@common/hooks/analytics/transactions-analytics.hooks';

export const ActivityList = () => {
  const transactions = useAccountTransactionsWithTransfers();
  const pendingTransactions = useCurrentAccountFilteredMempoolTransactionsState();

  const txids = useCurrentAccountLocalTxids();
  const localTxs = useCurrentAccountLocallySubmittedStacksTransactions();
  const allTransactions = [...pendingTransactions, ...transactions];
  useTrackChangedTransactions(allTransactions, localTxs);
  const hasTxs = txids.length > 0 || transactions.length > 0;

  if (!hasTxs) return <NoAccountActivity />;

  return (
    <>
      {txids.length > 0 && <LocalTxList txids={txids} />}
      {allTransactions.length > 0 && <TransactionList txs={allTransactions} />}
    </>
  );
};
