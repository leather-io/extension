import { useCurrentAccountFilteredMempoolTransactionsState } from '@query/mempool/mempool.hooks';
import { useAccountConfirmedTransactions } from '@store/accounts/account.hooks';

export function useCurrentAccountTxIds() {
  const confirmedTxs = useAccountConfirmedTransactions();
  const mempoolTxs = useCurrentAccountFilteredMempoolTransactionsState();
  return [...new Set([...confirmedTxs, ...mempoolTxs].map(tx => tx.tx_id))];
}
