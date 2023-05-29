import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';

export interface Brc20Token {
  available_balance: string;
  overall_balance: string;
  tick: string;
}

async function fetchBrc20TokensByAddress(address: string): Promise<Brc20Token[]> {
  const res = await fetch(`https://brc20api.bestinslot.xyz/v1/get_brc20_balance/${address}`);

  if (!res.ok) throw new Error('Failed to fetch BRC-20 token balances');

  return res.json();
}

type FetchBrc20TokensByAddressResp = Awaited<ReturnType<typeof fetchBrc20TokensByAddress>>;

export function useBrc20TokensByAddressQuery<T extends unknown = FetchBrc20TokensByAddressResp>(
  address: string,
  options?: AppUseQueryConfig<FetchBrc20TokensByAddressResp, T>
) {
  return useQuery({
    queryKey: [QueryPrefixes.Brc20TokenBalance],
    queryFn: () => fetchBrc20TokensByAddress(address),
    ...options,
  });
}
