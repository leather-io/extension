import { BnsNamesOwnByAddressResponse } from '@stacks/stacks-blockchain-api-types';
import { useQuery } from '@tanstack/react-query';

import { fetcher as fetchApi } from '@app/common/api/wrapped-fetch';
import { AppUseQueryConfig } from '@app/query/query-config';
import { StacksClient } from '@app/query/stacks/stacks-client';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { RateLimiter, useHiroApiRateLimiter } from '../rate-limiter';

const staleTime = 15 * 60 * 1000; // 15 min

const bnsQueryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  staleTime: staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
} as const;

// Fetch names owned by address via BNSx API
// https://docs.bns.xyz/integrate-bnsx/bnsx-api
async function getBnsxName(address: string): Promise<BnsNamesOwnByAddressResponse> {
  const url = `https://api.bns.xyz/v1/addresses/stacks/${address}`;
  const response = await fetchApi(url);
  if (!response.ok) {
    throw new Error('Unable to fetch BNSx names');
  }
  return response.json();
}

// Fetch names owned by an address.
//
// If `isTestnet` is `false` (aka mainnet), names are fetched from the
// BNSx API.
function getBnsNameFetcherFactory(client: StacksClient, limiter: RateLimiter, isTestnet: boolean) {
  const baseFetcher = async (address: string) => {
    await limiter.removeTokens(1);
    return client.namesApi.getNamesOwnedByAddress({ address, blockchain: 'stacks' });
  };
  if (isTestnet) {
    return baseFetcher;
  }
  // Fetch from BNSx API, and fallback to vanilla API in case
  // of error.
  return async (address: string) => {
    const bnsxFetch = getBnsxName(address);
    return bnsxFetch.catch(() => baseFetcher(address));
  };
}

type BnsNameFetcherResp = Awaited<ReturnType<ReturnType<typeof getBnsNameFetcherFactory>>>;

export function useGetBnsNamesOwnedByAddress<T extends unknown = BnsNameFetcherResp>(
  address: string,
  options?: AppUseQueryConfig<BnsNameFetcherResp, T>
) {
  const client = useStacksClientUnanchored();
  const { isTestnet } = useCurrentNetworkState();
  const limiter = useHiroApiRateLimiter();
  return useQuery({
    enabled: address !== '',
    queryKey: ['bns-names-by-address', address],
    queryFn: () => getBnsNameFetcherFactory(client, limiter, isTestnet)(address),
    ...bnsQueryOptions,
    ...options,
  });
}
