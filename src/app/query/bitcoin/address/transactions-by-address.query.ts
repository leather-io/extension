import { useQueries, useQuery } from '@tanstack/react-query';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

const staleTime = 5 * 1000;

const queryOptions = { staleTime, refetchInterval: staleTime };

export function useGetBitcoinTransactionsByAddressQuery<T extends unknown = BitcoinTx[]>(
  address: string,
  options?: AppUseQueryConfig<BitcoinTx[], T>
) {
  const client = useBitcoinClient();

  return useQuery({
    enabled: !!address,
    queryKey: ['btc-txs-by-address', address],
    queryFn: () => client.addressApi.getTransactionsByAddress(address),
    ...queryOptions,
    ...options,
  });
}

export function useGetBitcoinTransactionsByAddressesQuery<T extends unknown = BitcoinTx[]>(
  addresses: string[],
  options?: AppUseQueryConfig<BitcoinTx[], T>
) {
  const client = useBitcoinClient();

  return useQueries({
    queries: addresses.map(address => {
      return {
        enabled: !!address,
        queryKey: ['btc-txs-by-addresses', address],
        queryFn: () => client.addressApi.getTransactionsByAddress(address),
        ...queryOptions,
        ...options,
      };
    }),
  });
}
