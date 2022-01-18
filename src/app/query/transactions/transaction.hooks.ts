import { useCurrentAccountFilteredMempoolTransactionsState } from '@app/query/mempool/mempool.hooks';
import { useAccountConfirmedTransactions } from '@app/store/accounts/account.hooks';

function useCurrentAccountTxs() {
  const confirmedTxs = useAccountConfirmedTransactions();
  const mempoolTxs = useCurrentAccountFilteredMempoolTransactionsState();
  return [...new Set([...confirmedTxs, ...mempoolTxs])];
}

export function useCurrentAccountTxIds() {
  const currentAccountTxs = useCurrentAccountTxs();
  return currentAccountTxs.map(tx => tx.tx_id);
}
