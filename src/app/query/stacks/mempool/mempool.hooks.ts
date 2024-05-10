import { useMemo } from 'react';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { increaseValueByOneMicroStx } from '@app/common/math/helpers';
import { microStxToStx } from '@app/common/money/unit-conversion';
import { useTransactionsById } from '@app/query/stacks/transactions/transactions-by-id.query';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useStacksConfirmedTransactions } from '../transactions/transactions-with-transfers.hooks';
import { useAccountMempoolQuery } from './mempool.query';
import { calculatePendingTxsMoneyBalance } from './mempool.utils';

const droppedCache = new Map();

function useAccountMempoolTransactions(address: string) {
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
  const address = useCurrentStacksAccountAddress();
  const { query, transactions } = useAccountMempoolTransactions(address ?? '');
  return useMemo(() => {
    const nonEmptyTransactions = transactions.filter(tx => !!tx) as MempoolTransaction[];
    return { query, transactions: nonEmptyTransactions };
  }, [query, transactions]);
}

export function useCurrentAccountMempool() {
  const address = useCurrentStacksAccountAddress();
  return useAccountMempoolQuery(address ?? '');
}

export function useMempoolTxsInboundBalance(address: string) {
  const { transactions: pendingTransactions } = useStacksPendingTransactions();
  const confirmedTxs = useStacksConfirmedTransactions();

  return calculatePendingTxsMoneyBalance({
    address,
    confirmedTxs,
    pendingTxs: pendingTransactions,
    type: 'inbound',
  });
}

export function useMempoolTxsOutboundBalance(address: string) {
  const { transactions: pendingTransactions } = useStacksPendingTransactions();
  const confirmedTxs = useStacksConfirmedTransactions();

  return calculatePendingTxsMoneyBalance({
    address,
    confirmedTxs,
    pendingTxs: pendingTransactions,
    type: 'outbound',
  });
}

export function useStacksValidateFeeByNonce() {
  const { transactions } = useStacksPendingTransactions();

  function changeFeeByNonce({ nonce, fee }: { nonce: number; fee: number }) {
    return transactions.reduce((updatedFee, tx) => {
      if (Number(tx.nonce) === nonce && microStxToStx(tx.fee_rate).toNumber() >= fee) {
        return increaseValueByOneMicroStx(microStxToStx(tx.fee_rate));
      }
      return updatedFee;
    }, fee);
  }
  return { changeFeeByNonce };
}
