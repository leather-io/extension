import { useQuery } from '@tanstack/react-query';

import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

const staleTime = 5 * 1000;

const queryOptions = { staleTime, refetchInterval: staleTime };

export function useGetBitcoinTransactionsByAddressQuery<T extends unknown = BitcoinTransaction[]>(
  address: string,
  options?: AppUseQueryConfig<BitcoinTransaction[], T>
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
