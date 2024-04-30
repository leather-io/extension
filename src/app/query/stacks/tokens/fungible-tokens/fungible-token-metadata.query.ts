import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query';
import PQueue from 'p-queue';

import { useStacksClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { useHiroApiRateLimiter } from '../../hiro-rate-limiter';
import type { StacksClient } from '../../stacks-client';
import { FtAssetResponse } from '../token-metadata.utils';

const staleTime = 12 * 60 * 60 * 1000;

const queryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  staleTime: staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  retry: 0,
} as const;

function fetchFungibleTokenMetadata(client: StacksClient, limiter: PQueue) {
  return (principal: string) => async () => {
    return limiter.add(() => client.tokensApi.getFtMetadata(principal), {
      throwOnTimeout: true,
    });
  };
}

export function useGetFungibleTokenMetadataQuery(
  principal: string
): UseQueryResult<FtAssetResponse> {
  const client = useStacksClient();
  const network = useCurrentNetworkState();
  const limiter = useHiroApiRateLimiter();

  return useQuery({
    queryKey: ['get-ft-metadata', principal, network.chain.stacks.url],
    queryFn: fetchFungibleTokenMetadata(client, limiter)(principal),
    ...queryOptions,
  });
}

export function useGetFungibleTokenMetadataListQuery(
  principals: string[]
): UseQueryResult<FtAssetResponse>[] {
  const client = useStacksClient();
  const network = useCurrentNetworkState();
  const limiter = useHiroApiRateLimiter();

  return useQueries({
    queries: principals.map(principal => ({
      queryKey: ['get-ft-metadata', principal, network.chain.stacks.url],
      queryFn: fetchFungibleTokenMetadata(client, limiter)(principal),
      ...queryOptions,
    })),
  });
}
