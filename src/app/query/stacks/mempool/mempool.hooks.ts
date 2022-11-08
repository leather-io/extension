import { useMemo } from 'react';

import {
  MempoolTokenTransferTransaction,
  MempoolTransaction,
} from '@stacks/stacks-blockchain-api-types';
import BigNumber from 'bignumber.js';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useTransactionsById } from '@app/query/stacks/transactions/transactions-by-id.query';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/account.hooks';

import { useAccountMempoolQuery } from './mempool.query';

const droppedCache = new Map();

function useAccountUnanchoredMempoolTransactions(address: string) {
  const analytics = useAnalytics();
  const query = useAccountMempoolQuery(address);
  const accountMempoolTxs = query.data;
  const mempoolTxs = (accountMempoolTxs ? accountMempoolTxs.results : []) as MempoolTransaction[];
  const results = mempoolTxs.filter(
    tx => tx.tx_status === 'pending' && !droppedCache.has(tx.tx_id)
  );
  const txs = useTransactionsById(results.map(tx => tx.tx_id));
  return useMemo(() => {
    return {
      query,
      transactions: txs
        .map(tx => tx.data)
        .filter(tx => {
          if (typeof tx === 'undefined') return false;
          if (droppedCache.has(tx.tx_id)) return false;
          if (tx.tx_status !== 'pending') {
            // Stale txs persist in the mempool endpoint so we
            // need to cache dropped txids to prevent unneeded fetches
            void analytics.track('transaction_added_to_dropped_cache');
            droppedCache.set(tx.tx_id, true);
            return false;
          }
          return true;
        }),
    };
  }, [txs, query, analytics]);
}

export function useStacksPendingTransactions() {
  const address = useCurrentAccountStxAddressState();
  const { query, transactions } = useAccountUnanchoredMempoolTransactions(address ?? '');
  return useMemo(() => {
    const nonEmptyTransactions = transactions.filter(tx => !!tx) as MempoolTransaction[];
    return { query, transactions: nonEmptyTransactions };
  }, [query, transactions]);
}

export function useCurrentAccountMempool() {
  const address = useCurrentAccountStxAddressState();
  return useAccountMempoolQuery(address ?? '');
}

export function useCurrentAccountMempoolTransactionsBalance() {
  const { transactions: pendingTransactions } = useStacksPendingTransactions();
  const tokenTransferTxsBalance = (
    pendingTransactions.filter(
      tx => tx.tx_type === 'token_transfer'
    ) as unknown as MempoolTokenTransferTransaction[]
  ).reduce((acc, tx) => acc.plus(tx.token_transfer.amount), new BigNumber(0));
  const pendingTxsFeesBalance = pendingTransactions.reduce(
    (acc, tx) => acc.plus(tx.fee_rate),
    new BigNumber(0)
  );
  return tokenTransferTxsBalance.plus(pendingTxsFeesBalance);
}
