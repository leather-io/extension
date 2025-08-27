import { UseQueryOptions } from '@tanstack/react-query';

import { oneWeekInMs } from '@leather.io/utils';

export const balanceQueryOptions = {
  refetchOnMount: true,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  staleTime: 2000,
  gcTime: oneWeekInMs,
  retry: 0,
} satisfies Partial<UseQueryOptions>;
