import { UseQueryOptions } from '@tanstack/react-query';

export const balanceQueryOptions = {
  refetchOnMount: true,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  staleTime: 15 * 1000,
  retry: 0,
} satisfies Partial<UseQueryOptions>;

export const balanceQueryOptionsWithRefetch = {
  ...balanceQueryOptions,
  refetchInterval: 30 * 1000,
} satisfies Partial<UseQueryOptions>;
