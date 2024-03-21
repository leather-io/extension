import { BnsNamesOwnByAddressResponse } from '@stacks/stacks-blockchain-api-types';
import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';
import { StacksClient } from '@app/query/stacks/stacks-client';
import { useStacksClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { useHiroApiRateLimiter } from '../hiro-rate-limiter';
import { fetchNamesForAddress } from './bns.utils';

const staleTime = 24 * 60 * 60 * 1000; // 24 hours

const bnsQueryOptions = {
  keepPreviousData: true,
  cacheTime: Infinity,
  staleTime: staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
} as const;

type BnsNameFetcher = (address: string) => Promise<BnsNamesOwnByAddressResponse>;

interface GetBnsNameFetcherFactoryArgs {
  client: StacksClient;
  isTestnet: boolean;
  signal?: AbortSignal;
}

function getBnsNameFetcherFactory({
  client,
  isTestnet,
  signal,
}: GetBnsNameFetcherFactoryArgs): BnsNameFetcher {
  return async (address: string) => {
    return fetchNamesForAddress({ client, address, isTestnet, signal });
  };
}

type BnsNameFetcherResp = Awaited<ReturnType<ReturnType<typeof getBnsNameFetcherFactory>>>;

export function useGetBnsNamesOwnedByAddress<T extends unknown = BnsNameFetcherResp>(
  address: string,
  options?: AppUseQueryConfig<BnsNameFetcherResp, T>
) {
  const client = useStacksClient();
  const limiter = useHiroApiRateLimiter();
  const { isTestnet } = useCurrentNetworkState();
  return useQuery({
    enabled: address !== '',
    queryKey: [QueryPrefixes.BnsNamesByAddress, address],
    queryFn: async ({ signal }) => {
      return limiter.add(() => fetchNamesForAddress({ client, address, isTestnet, signal }), {
        signal,
        priority: 1,
        throwOnTimeout: true,
      });
    },
    ...bnsQueryOptions,
    ...options,
  });
}
