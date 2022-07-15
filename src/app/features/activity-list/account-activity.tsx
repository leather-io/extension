import { useAccountTransactionsWithTransfers } from '@app/common/hooks/account/use-account-transactions-with-transfers.hooks';
import { useCurrentAccountFilteredMempoolTransactionsState } from '@app/query/mempool/mempool.hooks';
import { useTrackChangedTransactions } from '@app/common/hooks/analytics/transactions-analytics.hooks';
import {
  useAccountSubmittedStacksTransactions,
  useAccountSubmittedTransactionsState,
  useCleanupSubmittedTransactions,
} from '@app/store/accounts/submitted-transactions.hooks';
import { TransactionsList } from '@app/features/activity-list/components/transactions-list';
import { SubmittedTransactionsList } from '@app/features/activity-list/components/submitted-transactions-list';

import { NoAccountActivity } from './components/no-account-activity';

export const ActivityList = () => {
  const transactions = useAccountTransactionsWithTransfers();
  const pendingTransactions = useCurrentAccountFilteredMempoolTransactionsState();

  useCleanupSubmittedTransactions();
  const submittedTransactions = useAccountSubmittedTransactionsState();
  const submittedStacksTransactions = useAccountSubmittedStacksTransactions();

  const allTransactions = [...pendingTransactions, ...transactions];
  const hasTxs = submittedTransactions.length || transactions.length;
  // TODO: Remove?
  useTrackChangedTransactions(allTransactions, submittedStacksTransactions);

  if (!hasTxs) return <NoAccountActivity />;

  return (
    <>
      {submittedTransactions.length > 0 && (
        <SubmittedTransactionsList txs={submittedTransactions} />
      )}
      {allTransactions.length > 0 && <TransactionsList txs={allTransactions} />}
    </>
  );
};
