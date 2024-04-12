import { useQuery } from '@tanstack/react-query';
import type { TokenInfo } from 'alex-sdk';

import { alex } from '@shared/utils/alex-sdk';

import type { AppUseQueryConfig } from '@app/query/query-config';

const queryOptions = {
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  retryDelay: 1000 * 60,
  staleTime: 1000 * 60 * 10,
};

export function useAlexSdkSwappableCurrencyQuery<T extends unknown = TokenInfo[]>(
  options?: AppUseQueryConfig<TokenInfo[], T>
) {
  return useQuery({
    queryKey: ['alex-sdk-swappable-currencies'],
    queryFn: async () => alex.fetchSwappableCurrency(),
    ...queryOptions,
    ...options,
  });
}
