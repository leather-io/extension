import { useMemo } from 'react';

import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { increaseValueByOneMicroStx, isUndefined, microStxToStx } from '@leather.io/utils';

import { useGetTransactionByIdListQuery } from '../transactions/transactions-by-id.query';
import { useGetAddressMempoolTransactionsQuery } from './mempool.query';

const droppedCache = new Map();

export function useStacksPendingTransactions(address: string) {
  const query = useGetAddressMempoolTransactionsQuery(address);
  const mempoolTxs = query.data ? query.data.results : [];
  const results = mempoolTxs.filter(
    tx => tx.tx_status === 'pending' && !droppedCache.has(tx.tx_id)
  );
  const txs = useGetTransactionByIdListQuery(results.map(tx => tx.tx_id));
  return useMemo(() => {
    return {
      query,
      transactions: txs
        .map(tx => tx.data)
        .filter(tx => {
          if (isUndefined(tx)) return false;
          if (droppedCache.has(tx.tx_id)) return false;
          if (tx.tx_status !== 'pending') {
            // Stale txs persist in the mempool endpoint so we
            // need to cache dropped txids to prevent unneeded fetches
            droppedCache.set(tx.tx_id, true);
            return false;
          }
          return true;
        }) as MempoolTransaction[],
    };
  }, [txs, query]);
}

export function useStacksValidateFeeByNonce(address: string) {
  const { transactions } = useStacksPendingTransactions(address);

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
