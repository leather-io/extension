import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types/generated';
import { useQueries, useQuery } from '@tanstack/react-query';

import { useStacksClient } from '@app/store/common/api-clients.hooks';

import { useHiroApiRateLimiter } from '../hiro-rate-limiter';

const options = {
  staleTime: 30 * 1000,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: true,
} as const;

export function useTransactionsById(txids: string[]) {
  const client = useStacksClient();
  const limiter = useHiroApiRateLimiter();

  async function transactionByIdFetcher(txId: string) {
    return limiter.add(
      () => client.transactionsApi.getTransactionById({ txId }) as unknown as MempoolTransaction,
      {
        throwOnTimeout: true,
      }
    );
  }

  return useQueries({
    queries: txids.map(txid => {
      return {
        queryKey: ['transaction-by-id', txid],
        queryFn: () => transactionByIdFetcher(txid),
        ...options,
      };
    }),
  });
}

export function useTransactionById(txid: string) {
  const client = useStacksClient();
  const limiter = useHiroApiRateLimiter();
  async function transactionByIdFetcher(txId: string) {
    return limiter.add(
      () =>
        client.transactionsApi.getTransactionById({ txId }) as unknown as
          | Transaction
          | MempoolTransaction,
      {
        throwOnTimeout: true,
      }
    );
  }

  return useQuery({
    queryKey: ['transaction-by-id', txid],
    queryFn: () => transactionByIdFetcher(txid),
    ...options,
  });
}
