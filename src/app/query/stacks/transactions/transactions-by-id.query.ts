import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types/generated';
import { useQueries, useQuery } from '@tanstack/react-query';

import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';

import { useHiroApiRateLimiter } from '../rate-limiter';

const options = {
  staleTime: 30 * 1000,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: true,
} as const;

export function useTransactionsById(txids: string[]) {
  const client = useStacksClientUnanchored();
  const limiter = useHiroApiRateLimiter();

  async function transactionByIdFetcher(txId: string) {
    await limiter.removeTokens(1);
    return client.transactionsApi.getTransactionById({ txId }) as unknown as MempoolTransaction;
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
  const client = useStacksClientUnanchored();
  const limiter = useHiroApiRateLimiter();
  async function transactionByIdFetcher(txId: string) {
    await limiter.removeTokens(1);
    return client.transactionsApi.getTransactionById({ txId }) as unknown as
      | Transaction
      | MempoolTransaction;
  }

  return useQuery({
    queryKey: ['transaction-by-id', txid],
    queryFn: () => transactionByIdFetcher(txid),
    ...options,
  });
}
