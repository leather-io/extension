import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';

export interface Brc20Token {
  availableBalance: string;
  overallBalance: string;
  ticker: string;
  transferableBalance: string;
}

interface Brc20TokensByAddressResponse {
  result?: {
    list: Brc20Token[];
    total: number;
  };
}

async function fetchBrc20TokensByAddress(address: string): Promise<Brc20TokensByAddressResponse> {
  const res = await fetch(
    `https://unisat.io/api/v3/brc20/tokens?address=${address}&cursor=0&size=100`,
    {
      method: 'GET',
      headers: {
        'X-Client': 'UniSat Wallet',
        'X-Version': '1.1.19',
      },
    }
  );

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
