import { useQueries, useQuery } from '@tanstack/react-query';

import { Paginated } from '@shared/models/api-types';

import { AppUseQueryConfig } from '@app/query/query-config';
import { StacksClient } from '@app/query/stacks/stacks-client';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';
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

const queryOptions = { cacheTime: staleTime, staleTime } as const;

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

export function useGetNonFungibleTokenHoldingsQuery<
  T extends unknown = FetchNonFungibleTokenHoldingsResp
>(address: string, options?: AppUseQueryConfig<FetchNonFungibleTokenHoldingsResp, T>) {
  const client = useStacksClientUnanchored();
  const network = useCurrentNetworkState();
  const limiter = useHiroApiRateLimiter();

  return useQuery({
    enabled: !!address,
    queryKey: ['get-nft-holdings', address, network.chain.stacks.url],
    queryFn: () => fetchNonFungibleTokenHoldings(client, limiter)(address) as any,
    ...queryOptions,
    ...options,
  });
}

export function useGetNonFungibleTokenHoldingsListQuery<
  T extends unknown = FetchNonFungibleTokenHoldingsResp
>(accounts: StacksAccount[], options?: AppUseQueryConfig<FetchNonFungibleTokenHoldingsResp, T>) {
  const client = useStacksClientUnanchored();
  const network = useCurrentNetworkState();
  const limiter = useHiroApiRateLimiter();

  return useQueries({
    queries: accounts.map(account => ({
      queryKey: ['get-nft-holdings', account.address, network.chain.stacks.url],
      queryFn: () => fetchNonFungibleTokenHoldings(client, limiter)(account.address) as any,
      ...queryOptions,
      ...options,
    })),
  });
}
