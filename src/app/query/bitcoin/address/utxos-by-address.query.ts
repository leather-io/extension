import { useQuery } from '@tanstack/react-query';

import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

const staleTime = 15 * 60 * 1000;

const queryOptions = {
  cacheTime: staleTime,
};

export function useGetUtxosByAddressQuery(address: string) {
  const client = useBitcoinClient();

  return useQuery({
    enabled: !!address,
    queryKey: ['btc-utxos-by-address', address],
    queryFn: () => client.addressApi.getUtxosByAddress(address),
    ...queryOptions,
  });
}
