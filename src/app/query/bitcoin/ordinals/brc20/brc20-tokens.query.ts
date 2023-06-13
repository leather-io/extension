import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { QueryPrefixes } from '@app/query/query-prefixes';

interface Brc20TokenResponse {
  available_balance: string;
  overall_balance: string;
  tick: string;
}

export interface Brc20Token extends Brc20TokenResponse {
  decimals: number;
}

interface Brc20TokenTicker {
  ticker: {
    tick: string;
    max_supply: string;
    decimals: number;
    limit_per_mint: string;
    remaining_supply: string;
    deploy_incr_number: number;
  }[];
  sales: { total_sale: string; sale_24h: string; sale_7d: string }[];
  holders: { holders: number }[];
}

async function fetchTickerData(ticker: string): Promise<Brc20TokenTicker[]> {
  const res = await fetch(`https://brc20api.bestinslot.xyz/v1/get_brc20_ticker/${ticker}`);
  if (!res.ok) throw new Error('Failed to fetch BRC-20 token ticker data');
  return res.json();
}

async function fetchBrc20TokensByAddress(address: string): Promise<Brc20Token[]> {
  const res = await fetch(`https://brc20api.bestinslot.xyz/v1/get_brc20_balance/${address}`);

  if (!res.ok) throw new Error('Failed to fetch BRC-20 token balances');
  const tokensData = await res.json();

  const tickerPromises = tokensData.map((token: Brc20TokenResponse) => {
    return fetchTickerData(token.tick);
  });

  const tickerData = await Promise.all(tickerPromises);

  // add decimals to token data
  return tokensData.map((token: Brc20TokenResponse, index: number) => {
    return {
      ...token,
      decimals: tickerData[index].ticker[0].decimals,
    };
  });
}

type FetchBrc20TokensByAddressResp = Awaited<ReturnType<typeof fetchBrc20TokensByAddress>>;

export function useBrc20TokensByAddressQuery<T extends unknown = FetchBrc20TokensByAddressResp>(
  address: string,
  options?: AppUseQueryConfig<FetchBrc20TokensByAddressResp, T>
) {
  return useQuery({
    queryKey: [QueryPrefixes.Brc20TokenBalance, address],
    queryFn: () => fetchBrc20TokensByAddress(address),
    ...options,
  });
}
