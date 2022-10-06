import { UseQueryOptions } from '@tanstack/react-query';

export const marketDataQueryOptions: UseQueryOptions = {
  staleTime: 1000 * 60,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  refetchIntervalInBackground: false,
} as const;
