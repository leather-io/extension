import { bitflow } from '@shared/utils/bitflow-sdk';

export function createGetBitflowAvailableTokensQueryOptions() {
  return {
    queryKey: ['get-bitflow-available-tokens'],
    queryFn: () => bitflow.getAvailableTokens(),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retryDelay: 1000 * 60,
    staleTime: 1000 * 60 * 10,
  };
}
