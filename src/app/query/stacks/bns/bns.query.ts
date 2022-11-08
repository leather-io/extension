import { useQuery } from '@tanstack/react-query';

import { StacksClient } from '@app/query/stacks/stacks-client';
import { useStacksClient } from '@app/store/common/api-clients.hooks';

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
  return (address: string) => () =>
    client.namesApi.getNamesOwnedByAddress({ address, blockchain: 'stacks' });
}

export function useGetBnsNamesOwnedByAddress(address: string) {
  const client = useStacksClient();
  return useQuery({
    enabled: address !== '',
    queryKey: ['bns-names-by-address', address],
    queryFn: getBnsNameFetcherFactory(client)(address),
    ...bnsQueryOptions,
  });
}
