import { useQuery } from '@tanstack/react-query';

import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

const staleTime = 15 * 60 * 1000;

const queryOptions = {
  cacheTime: staleTime,
};

export function useGetTransactionsByAddressQuery(address: string) {
  const client = useBitcoinClient();

  return useQuery({
    queryKey: ['btc-txs-by-address', address],
    queryFn: () => client.addressApi.getTransactionsByAddress(address),
    ...queryOptions,
  });
}
