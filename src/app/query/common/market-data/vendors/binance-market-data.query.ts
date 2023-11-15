import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { CryptoCurrencies } from '@shared/models/currencies.model';

import { marketDataQueryOptions } from '../market-data.query';

async function fetchBinanceMarketData(currency: CryptoCurrencies) {
  const resp = await axios.get(
    `https://api1.binance.com/api/v3/ticker/price?symbol=${currency}USDT`
  );
  return resp.data;
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
