import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { StacksClient } from '@app/query/stacks/stacks-client';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';

const staleTime = 15 * 60 * 1000; // 15 min

const bnsQueryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  staleTime: staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
} as const;

function getBnsNameFetcherFactory(client: StacksClient) {
  return (address: string) =>
    client.namesApi.getNamesOwnedByAddress({ address, blockchain: 'stacks' });
}

type BnsNameFetcherResp = Awaited<ReturnType<ReturnType<typeof getBnsNameFetcherFactory>>>;

export function useGetBnsNamesOwnedByAddress<T extends unknown = BnsNameFetcherResp>(
  address: string,
  options?: AppUseQueryConfig<BnsNameFetcherResp, T>
) {
  const client = useStacksClientUnanchored();
  return useQuery({
    enabled: address !== '',
    queryKey: ['bns-names-by-address', address],
    queryFn: () => getBnsNameFetcherFactory(client)(address),
    ...bnsQueryOptions,
    ...options,
  });
}
