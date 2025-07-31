import { UseQueryOptions } from '@tanstack/react-query';

import { minutesInMs, secondsInMs } from '@leather.io/utils';

export const balanceQueryOptions = {
  refetchOnMount: true,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  staleTime: secondsInMs(10),
  gcTime: minutesInMs(10),
  retry: (failureCount: number, error: Error) =>
    error?.name === 'AbortError' || error?.name === 'CanceledError' ? failureCount < 2 : false,
} satisfies Partial<UseQueryOptions>;

export const balanceQueryOptionsWithRefetch = {
  ...balanceQueryOptions,
  refetchInterval: secondsInMs(30),
} satisfies Partial<UseQueryOptions>;
