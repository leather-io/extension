import { useQuery } from '@tanstack/react-query';

import { CryptoCurrencies } from '@shared/models/currencies.model';

import { logAndThrow } from '@app/common/utils';

import { marketDataQueryOptions } from '../market-data.query';

async function fetchBinanceMarketData(currency: CryptoCurrencies) {
  const resp = await fetch(`https://api1.binance.com/api/v3/ticker/price?symbol=${currency}USDT`);
  if (!resp.ok) logAndThrow('Cannot load binance data');
  return resp.json();
}

export function selectBinanceUsdPrice(resp: any) {
  return resp?.price;
}

export function useBinanceMarketDataQuery(currency: CryptoCurrencies) {
  return useQuery({
    queryFn: () => fetchBinanceMarketData(currency),
    queryKey: [`binance-market-data-${currency}`],
    ...marketDataQueryOptions,
  });
}
