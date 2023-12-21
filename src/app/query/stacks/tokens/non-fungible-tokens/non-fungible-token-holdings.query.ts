import { useQuery } from '@tanstack/react-query';

import { logger } from '@shared/logger';
import { Paginated } from '@shared/models/api-types';

import { QueryPrefixes } from '@app/query/query-prefixes';
import { StacksClient } from '@app/query/stacks/stacks-client';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { RateLimiter, useHiroApiRateLimiter } from '../../rate-limiter';

const staleTime = 15 * 60 * 1000; // 15 min

interface NonFungibleTokenHoldingListResult {
  asset_identifier: string;
  value: {
    hex: string;
    repr: string;
  };
  block_height: number;
  tx_id: string;
}

const queryOptions = { cacheTime: staleTime, staleTime, refetchhOnFocus: false } as const;

type FetchNonFungibleTokenHoldingsResp = Paginated<NonFungibleTokenHoldingListResult[]>;

function fetchNonFungibleTokenHoldings(client: StacksClient, limiter: RateLimiter) {
  return async (address: string) => {
    if (!address) return;
    await limiter.removeTokens(1);
    return client.nonFungibleTokensApi.getNftHoldings({
      principal: address,
      limit: 50,
    }) as unknown as Promise<FetchNonFungibleTokenHoldingsResp>;
  };
}

function makeNonFungibleTokenHoldingsQuery(
  address: string,
  network: string,
  client: StacksClient,
  limiter: RateLimiter
) {
  if (address === '') logger.warn('No address passed to ' + QueryPrefixes.GetNftHoldings);
  return {
    enabled: !!address,
    queryKey: [QueryPrefixes.GetNftHoldings, address, network],
    queryFn: () => fetchNonFungibleTokenHoldings(client, limiter)(address),
    ...queryOptions,
  };
}

export function useGetNonFungibleTokenHoldingsQuery(address: string) {
  const client = useStacksClientUnanchored();
  const network = useCurrentNetworkState();
  const limiter = useHiroApiRateLimiter();

  return useQuery(
    makeNonFungibleTokenHoldingsQuery(address, network.chain.stacks.url, client, limiter)
  );
}
