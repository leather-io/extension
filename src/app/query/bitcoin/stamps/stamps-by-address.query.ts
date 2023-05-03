import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';

import { Stamp } from './stamp-collection.query';

const stampsByAddressQueryOptions = {
  cacheTime: Infinity,
  staleTime: 15 * 60 * 1000,
} as const;

async function fetchStampsByAddress(address: string): Promise<Stamp[]> {
  return fetch(`https://stampchain.io/api/stamps?wallet_address=${address}`).then(res =>
    res.json()
  );
}

type FetchStampsByAddressResp = Awaited<ReturnType<typeof fetchStampsByAddress>>;

export function useStampsByAddressQuery<T extends unknown = FetchStampsByAddressResp>(
  address: string,
  options?: AppUseQueryConfig<FetchStampsByAddressResp, T>
) {
  return useQuery({
    queryKey: [QueryPrefixes.StampsByAddress],
    queryFn: () => fetchStampsByAddress(address),
    ...stampsByAddressQueryOptions,
    ...options,
  });
}
