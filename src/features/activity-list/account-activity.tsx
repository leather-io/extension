import { useAccountTransactionsWithTransfers } from '@common/hooks/account/use-account-transactions-with-transfers.hooks';
import { useCurrentAccountFilteredMempoolTransactionsState } from '@query/mempool/mempool.hooks';
import { useTrackChangedTransactions } from '@common/hooks/analytics/transactions-analytics.hooks';
import {
  useCurrentAccountLocallySubmittedStacksTransactions,
  useCurrentAccountLocalTxids,
} from '@store/accounts/account-activity.hooks';
import { TransactionList } from '@features/transaction-list/transaction-list';
import { LocalTxList } from '@features/local-transaction-activity/local-tx-list';

import { NoAccountActivity } from './components/no-account-activity';

export const ActivityList = () => {
  const transactions = useAccountTransactionsWithTransfers();
  const pendingTransactions = useCurrentAccountFilteredMempoolTransactionsState();

  const localTxs = useCurrentAccountLocallySubmittedStacksTransactions();
  const localTxids = useCurrentAccountLocalTxids();
  const allTransactions = [...pendingTransactions, ...transactions];
  const hasTxs = localTxids.length > 0 || transactions.length > 0;
  useTrackChangedTransactions(allTransactions, localTxs);

  if (!hasTxs) return <NoAccountActivity />;

  return (
    <>
      {localTxids.length > 0 && <LocalTxList txids={localTxids} />}
      {allTransactions.length > 0 && <TransactionList txs={allTransactions} />}
    </>
  );
};
