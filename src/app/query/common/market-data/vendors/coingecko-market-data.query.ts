import { useQuery } from '@tanstack/react-query';

import { CryptoCurrencies } from '@shared/models/currencies.model';

import { logAndThrow } from '@app/common/utils';

import { marketDataQueryOptions } from '../market-data.query';

const currencyNameMap: Record<CryptoCurrencies, string> = {
  BTC: 'bitcoin',
  STX: 'blockstack',
};

async function fetchCoingeckoMarketData(currency: CryptoCurrencies) {
  const resp = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${currencyNameMap[currency]}&vs_currencies=usd`
  );
  if (!resp.ok) logAndThrow('Cannot load coingecko data');
  return resp.json();
}

export function selectCoingeckoUsdPrice(resp: any) {
  return resp?.blockstack?.usd;
}

export function useCoinGeckoMarketDataQuery(currency: CryptoCurrencies) {
  return useQuery({
    queryFn: () => fetchCoingeckoMarketData(currency),
    queryKey: [`coin-gecko-market-data-${currency}`],
    ...marketDataQueryOptions,
  });
}
