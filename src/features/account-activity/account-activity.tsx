import React, { useMemo } from 'react';

import { useAccountActivity } from '@store/accounts/account.hooks';
import { useCurrentAccountLocalTxids } from '@store/accounts/account-activity.hooks';
import { TransactionList } from '@components/popup/transaction-list';
import { createTxDateFormatList } from '@common/group-txs-by-date';
import { LocalTxList } from '@features/local-transaction-activity/local-tx-list';

import { NoAccountActivity } from './components/no-account-activity';

export const ActivityList = () => {
  const transactions = useAccountActivity();
  const groupedTxs = useMemo(
    () => (transactions ? createTxDateFormatList(transactions) : []),
    [transactions]
  );
  const txids = useCurrentAccountLocalTxids();
  const hasTxs = txids.length > 0 || transactions.length > 0;

  if (!hasTxs) return <NoAccountActivity />;

  return (
    <>
      {txids.length > 0 && <LocalTxList txids={txids} />}
      {transactions.length > 0 && <TransactionList txsByDate={groupedTxs} />}
    </>
  );
};
