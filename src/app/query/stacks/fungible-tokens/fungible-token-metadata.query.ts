import { FungibleTokenMetadata } from '@stacks/stacks-blockchain-api-types';
import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query';

import { NetworkModes, chainIdToNetworkModeMap } from '@shared/constants';

import { fetcher } from '@app/common/api/wrapped-fetch';
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
  refetchOnWindowFocus: false,
  retry: 0,
} as const;

const hiroApiUrlMap: Record<NetworkModes, string> = {
  mainnet: 'https://api.hiro.so',
  testnet: 'https://api.testnet.hiro.so',
};

function fetchUnanchoredAccountInfo(network: NetworkModes, limiter: RateLimiter) {
  return (contractId: string) => async () => {
    await limiter.removeTokens(1);
    const resp = await fetcher(hiroApiUrlMap[network] + `/metadata/v1/ft/${contractId}`);
    const data = await resp.json();
    return data;
  };
}

export function useGetFungibleTokenMetadataQuery(
  contractId: string
): UseQueryResult<FungibleTokenMetadata> {
  const { chain } = useCurrentNetworkState();
  const limiter = useHiroApiRateLimiter();
  return useQuery({
    queryKey: ['get-ft-metadata', contractId, chain.stacks.url],
    queryFn: fetchUnanchoredAccountInfo(
      chainIdToNetworkModeMap[chain.stacks.chainId],
      limiter
    )(contractId),
    ...queryOptions,
  });
}

export function useGetFungibleTokenMetadataListQuery(
  contractIds: string[]
): UseQueryResult<FungibleTokenMetadata>[] {
  const { chain } = useCurrentNetworkState();
  const limiter = useHiroApiRateLimiter();
  return useQueries({
    queries: contractIds.map(contractId => ({
      queryKey: ['get-ft-metadata', contractId, chain.stacks.url],
      queryFn: fetchUnanchoredAccountInfo(
        chainIdToNetworkModeMap[chain.stacks.chainId],
        limiter
      )(contractId),
      ...queryOptions,
    })),
  });
}
