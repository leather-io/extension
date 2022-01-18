import { useQuery } from 'react-query';

import { fetchWithTimeout } from '@app/common/api/wrapped-fetch';

const staleTime = 15 * 60 * 1000; // 15 min

const networkStatusQueryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
} as const;

function getNetworkStatusFetcher(url: string) {
  return fetchWithTimeout(url, { timeout: 4500 });
}

export function useGetNetworkStatus(url: string) {
  return useQuery({
    queryKey: ['network-status', url],
    queryFn: () => getNetworkStatusFetcher(url),
    ...networkStatusQueryOptions,
  });
}
