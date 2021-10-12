import { useQueries, useQuery, UseQueryResult } from 'react-query';

import { useApi, Api } from '@store/common/api-clients.hooks';
import { BnsNamesOwnByAddressResponse } from '@stacks/blockchain-api-client';

const STALE_TIME = 15 * 60 * 1000; // 15 min

const bnsQueryOptions = {
  keepPreviousData: true,
  cacheTime: STALE_TIME,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
} as const;

function getBnsNameFetcherFactory(api: Api) {
  return (address: string) => () =>
    api.bnsApi.getNamesOwnedByAddress({ address, blockchain: 'stacks' });
}

export function useGetBnsNamesOwnedByAddress(address: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['bns-names-by-address', address],
    queryFn: getBnsNameFetcherFactory(api)(address),
    ...bnsQueryOptions,
  });
}

export function useGetBnsNamesOwnedByAddressList(addresses: string[]) {
  const api = useApi();
  return useQueries(
    addresses.map(address => ({
      queryKey: ['bns-names-by-address', address],
      queryFn: getBnsNameFetcherFactory(api)(address),
      ...bnsQueryOptions,
    }))
  ) as UseQueryResult<BnsNamesOwnByAddressResponse, Error>[];
}
