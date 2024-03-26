import { useQuery } from '@tanstack/react-query';

import { alex } from '@shared/utils/alex-sdk';

export function useAlexSdkSwappableCurrencyQuery() {
  return useQuery(['alex-sdk-swappable-currencies'], async () => alex.fetchSwappableCurrency(), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retryDelay: 1000 * 60,
    staleTime: 1000 * 60 * 10,
  });
}
