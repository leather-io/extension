import { BnsNamesOwnByAddressResponse } from '@stacks/stacks-blockchain-api-types';
import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';
import { StacksClient } from '@app/query/stacks/stacks-client';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { RateLimiter, useHiroApiRateLimiter } from '../rate-limiter';
import { fetchNamesForAddress } from './bns.utils';

const staleTime = 15 * 60 * 1000; // 15 min

const bnsQueryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  staleTime: staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
} as const;

type BnsNameFetcher = (address: string) => Promise<BnsNamesOwnByAddressResponse>;

interface GetBnsNameFetcherFactoryArgs {
  client: StacksClient;
  limiter: RateLimiter;
  isTestnet: boolean;
}
function getBnsNameFetcherFactory({
  client,
  limiter,
  isTestnet,
}: GetBnsNameFetcherFactoryArgs): BnsNameFetcher {
  return async (address: string) => {
    await limiter.removeTokens(1);
    return fetchNamesForAddress({ client, address, isTestnet });
  };
}

type BnsNameFetcherResp = Awaited<ReturnType<ReturnType<typeof getBnsNameFetcherFactory>>>;

export function useGetBnsNamesOwnedByAddress<T extends unknown = BnsNameFetcherResp>(
  address: string,
  options?: AppUseQueryConfig<BnsNameFetcherResp, T>
) {
  const client = useStacksClientUnanchored();
  const limiter = useHiroApiRateLimiter();
  const { isTestnet } = useCurrentNetworkState();
  return useQuery({
    enabled: address !== '',
    queryKey: [QueryPrefixes.BnsNamesByAddress, address],
    queryFn: () => getBnsNameFetcherFactory({ client, limiter, isTestnet })(address),
    ...bnsQueryOptions,
    ...options,
  });
}
