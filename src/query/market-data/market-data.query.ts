import { useQuery, UseQueryOptions } from 'react-query';

const marketDataQueryOptions: UseQueryOptions = {
  staleTime: 1000 * 120,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  refetchIntervalInBackground: false,
} as const;

export function useMarketDataQueryFactory({ url, queryKey }: { url: string; queryKey: string }) {
  async function marketDataFetcher() {
    return fetch(url).then(r => r.json());
  }

  return useQuery({
    queryKey: [queryKey],
    queryFn: () => marketDataFetcher(),
    ...marketDataQueryOptions,
  });
}
