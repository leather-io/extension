import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { Currency } from 'alex-sdk';

import { alex } from '@leather.io/query';

export function useAlexSdkLatestPricesQuery(): UseQueryResult<
  Partial<{
    [currency in Currency]: number;
  }>,
  Error
> {
  return useQuery({
    queryKey: ['alex-sdk-latest-prices'],
    queryFn: async () => alex.getLatestPrices(),
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retryDelay: 1000 * 60,
    staleTime: 1000 * 60 * 10,
  });
}
