import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';

import { UtxoResponseItem } from '../bitcoin-client';

const staleTime = 3 * 60 * 1000;

const queryOptions = { staleTime, refetchOnWindowFocus: false };

export function useGetUtxosByAddressQuery<T extends unknown = UtxoResponseItem[]>(
  address: string,
  options?: AppUseQueryConfig<UtxoResponseItem[], T>
) {
  const client = useBitcoinClient();
  return useQuery({
    enabled: !!address,
    queryKey: ['btc-utxos-by-address', address],
    queryFn: () => client.addressApi.getUtxosByAddress(address),
    ...queryOptions,
    ...options,
  });
}
