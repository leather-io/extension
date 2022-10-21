import { useQuery } from '@tanstack/react-query';

import { fetchWithTimeout } from '@app/common/api/wrapped-fetch';

import { RateLimiter, useHiroApiRateLimiter } from '../rate-limiter';

const staleTime = 15 * 60 * 1000; // 15 min

const networkStatusQueryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
} as const;

async function getNetworkStatusFetcher(url: string, limiter: RateLimiter) {
  await limiter.removeTokens(1);
  return fetchWithTimeout(url, { timeout: 4500 });
}

export function useGetNetworkStatus(url: string) {
  const limiter = useHiroApiRateLimiter();

  return useQuery({
    queryKey: ['network-status', url],
    queryFn: () => getNetworkStatusFetcher(url, limiter),
    ...networkStatusQueryOptions,
  });
}
