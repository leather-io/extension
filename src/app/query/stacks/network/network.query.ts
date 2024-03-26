import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PQueue from 'p-queue';

import { useHiroApiRateLimiter } from '../hiro-rate-limiter';

const staleTime = 15 * 60 * 1000; // 15 min

const networkStatusQueryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
} as const;

async function getNetworkStatusFetcher(url: string, limiter: PQueue) {
  const resp = await limiter.add(() => axios.get(url, { timeout: 30000 }), {
    throwOnTimeout: true,
    priority: 1,
  });

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
