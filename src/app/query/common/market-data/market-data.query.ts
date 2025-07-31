import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';

import type { FungibleCryptoAsset } from '@leather.io/models';
import { getMarketDataService } from '@leather.io/services';
import { oneMinInMs } from '@leather.io/utils';

import { toFetchState } from '@app/services/fetch-state';

export function useMarketData(asset: FungibleCryptoAsset) {
  return toFetchState(useGetMarketDataQuery(asset));
}

function useGetMarketDataQuery(asset: FungibleCryptoAsset) {
  return useQuery({
    queryKey: ['market-data-service-get-market-data', asset],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getMarketDataService().getMarketData(asset, signal),
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: oneMinInMs,
    gcTime: oneMinInMs,
  });
}
