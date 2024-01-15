import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
  const resp = await axios.get(url, { timeout: 4500 });
  return resp.data;
}

export function useGetNetworkStatus(url: string) {
  const limiter = useHiroApiRateLimiter();

  return useQuery({
    queryKey: ['network-status', url],
    queryFn: () => getNetworkStatusFetcher(url, limiter),
    ...networkStatusQueryOptions,
  });
}
