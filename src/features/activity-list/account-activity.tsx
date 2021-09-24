import React from 'react';

import { useCurrentAccountLocalTxids } from '@store/accounts/account-activity.hooks';
import { TransactionList } from '@components/popup/transaction-list';
import { LocalTxList } from '@features/local-transaction-activity/local-tx-list';

import { NoAccountActivity } from './components/no-account-activity';
import { useAccountTransactionsWithTransfers } from '@common/hooks/account/use-account-transactions-with-transfers.hooks';
import { useCurrentAccountMempoolTransactionsState } from '@store/accounts/account.hooks';

export const ActivityList = () => {
  const transactions = useAccountTransactionsWithTransfers();
  const pendingTransactions = useCurrentAccountMempoolTransactionsState();

  const txids = useCurrentAccountLocalTxids();
  const allTransactions = [...pendingTransactions, ...transactions];
  const hasTxs = txids.length > 0 || transactions.length > 0;

  if (!hasTxs) return <NoAccountActivity />;

  return (
    <>
      {txids.length > 0 && <LocalTxList txids={txids} />}
      {allTransactions.length > 0 && <TransactionList txs={allTransactions} />}
    </>
  );
};
