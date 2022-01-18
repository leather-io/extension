import { logger } from '@shared/logger';
import { useTransactionsById } from '@app/query/transactions/transactions-by-id.query';
import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/account.hooks';
import { useAccountMempool } from './mempool.query';

const droppedCache = new Map();

function useAccountUnanchoredMempoolTransactions(address: string) {
  const { data: accountMempoolTxs } = useAccountMempool(address);
  const mempoolTxs = (accountMempoolTxs ? accountMempoolTxs.results : []) as MempoolTransaction[];
  const results = mempoolTxs.filter(
    tx => tx.tx_status === 'pending' && !droppedCache.has(tx.tx_id)
  );
  const txs = useTransactionsById(results.map(tx => tx.tx_id));
  return txs
    .map(tx => tx.data)
    .filter(tx => {
      if (typeof tx === 'undefined') return false;
      if (droppedCache.has(tx.tx_id)) return false;
      if (tx.tx_status !== 'pending') {
        // because stale txs persist in the mempool endpoint
        // we should cache dropped txids to prevent unneeded fetches
        droppedCache.set(tx.tx_id, true);
        return false;
      }
      return true;
    });
}

export function useCurrentAccountFilteredMempoolTransactionsState() {
  const address = useCurrentAccountStxAddressState();
  if (!address)
    logger.error(
      `Attempting to fetch from mempool with no address in ${useCurrentAccountFilteredMempoolTransactionsState.name}`
    );
  return useAccountUnanchoredMempoolTransactions(address ?? '').filter(
    tx => !!tx
  ) as MempoolTransaction[];
}

export function useCurrentAccountMempool() {
  const address = useCurrentAccountStxAddressState();
  if (!address)
    logger.error(
      `Attempting to fetch from mempool with no address in ${useCurrentAccountFilteredMempoolTransactionsState.name}`
    );
  return useAccountMempool(address ?? '');
}
