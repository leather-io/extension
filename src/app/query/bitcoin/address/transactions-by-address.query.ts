import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

const staleTime = 15 * 60 * 1000;

const queryOptions = {
  cacheTime: staleTime,
};

export function useGetBitcoinTransactionsByAddressQuery(
  address: string
): UseQueryResult<BitcoinTransaction[]> {
  const client = useBitcoinClient();

  return useQuery({
    enabled: !!address,
    queryKey: ['btc-txs-by-address', address],
    queryFn: () => client.addressApi.getTransactionsByAddress(address),
    ...queryOptions,
  });
}
