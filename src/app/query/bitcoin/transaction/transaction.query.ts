import * as btc from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';
import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query';

import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

import { BitcoinClient } from '../bitcoin-client';

function fetchBitcoinTransaction(client: BitcoinClient) {
  return async (txid: string) => {
    return client.transactionsApi.getBitcoinTransaction(txid);
  };
}

type FetchBitcoinTransaction = Awaited<ReturnType<ReturnType<typeof fetchBitcoinTransaction>>>;

// ts-unused-exports:disable-next-line
export function useGetBitcoinTransaction<T extends unknown = FetchBitcoinTransaction>(
  txid: string,
  options?: AppUseQueryConfig<FetchBitcoinTransaction, T>
) {
  const client = useBitcoinClient();
  return useQuery({
    queryKey: ['bitcoin-transaction', txid],
    queryFn: () => fetchBitcoinTransaction(client)(txid),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
}

const queryOptions = {
  cacheTime: Infinity,
  staleTime: 15 * 60 * 1000,
  refetchOnWindowFocus: false,
} as const;

export function useGetBitcoinTransactionQueries(
  inputs: btc.TransactionInputRequired[]
): UseQueryResult<BitcoinTransaction>[] {
  const client = useBitcoinClient();

  return useQueries({
    queries: inputs.map(input => {
      const txId = bytesToHex(input.txid);
      return {
        queryKey: ['bitcoin-transaction', txId],
        queryFn: () => fetchBitcoinTransaction(client)(txId),
        ...queryOptions,
      };
    }),
  });
}
