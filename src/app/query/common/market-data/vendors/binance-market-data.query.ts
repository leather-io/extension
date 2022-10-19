import { useQuery } from '@tanstack/react-query';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { fetchJson } from '@app/common/utils';
import { marketDataQueryOptions } from '../market-data.query';

function fetchBinanceMarketData(currency: CryptoCurrencies) {
  return fetchJson(`https://api1.binance.com/api/v3/ticker/price?symbol=${currency}USDT`);
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
