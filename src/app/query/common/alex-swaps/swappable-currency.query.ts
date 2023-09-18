import { useQuery } from '@tanstack/react-query';
import { AlexSDK } from 'alex-sdk';

export function useSwappableCurrencyQuery(alexSDK: AlexSDK) {
  return useQuery(
    ['alex-supported-swap-currencies'],
    async () => alexSDK.fetchSwappableCurrency(),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retryDelay: 1000 * 60,
      staleTime: 1000 * 60 * 10,
    }
  );
}
