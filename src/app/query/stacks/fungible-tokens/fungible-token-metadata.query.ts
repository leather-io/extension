import { FungibleTokenMetadata } from '@stacks/stacks-blockchain-api-types';
import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query';

import { StacksClient } from '@app/query/stacks/stacks-client';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { RateLimiter, useHiroApiRateLimiter } from '../rate-limiter';

const staleTime = 12 * 60 * 60 * 1000;

const queryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  staleTime: staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
  retry: 2,
  retryDelay: 2 * 60 * 1000,
} as const;

function fetchUnanchoredAccountInfo(client: StacksClient, limiter: RateLimiter) {
  return (contractId: string) => async () => {
    await limiter.removeTokens(1);
    return client.fungibleTokensApi.getContractFtMetadata({ contractId });
  };
}

export function useGetFungibleTokenMetadataQuery(
  contractId: string
): UseQueryResult<FungibleTokenMetadata> {
  const client = useStacksClientUnanchored();
  const network = useCurrentNetworkState();
  const limiter = useHiroApiRateLimiter();
  return useQuery({
    queryKey: ['get-ft-metadata', contractId, network.chain.stacks.url],
    queryFn: fetchUnanchoredAccountInfo(client, limiter)(contractId),
    ...queryOptions,
  });
}

export function useGetFungibleTokenMetadataListQuery(
  contractIds: string[]
): UseQueryResult<FungibleTokenMetadata>[] {
  const client = useStacksClientUnanchored();
  const network = useCurrentNetworkState();
  const limiter = useHiroApiRateLimiter();
  return useQueries({
    queries: contractIds.map(contractId => ({
      queryKey: ['get-ft-metadata', contractId, network.chain.stacks.url],
      queryFn: fetchUnanchoredAccountInfo(client, limiter)(contractId),
      ...queryOptions,
    })),
  });
}
