import { useQuery } from 'react-query';

import { useApi, Api } from '@app/store/common/api-clients.hooks';

const staleTime = 15 * 60 * 1000; // 15 min

const bnsQueryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  staleTime: staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
} as const;

function getBnsNameFetcherFactory(api: Api) {
  return (address: string) => () =>
    api.namesApi.getNamesOwnedByAddress({ address, blockchain: 'stacks' });
}

export function useGetBnsNamesOwnedByAddress(address: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['bns-names-by-address', address],
    queryFn: getBnsNameFetcherFactory(api)(address),
    ...bnsQueryOptions,
  });
}
