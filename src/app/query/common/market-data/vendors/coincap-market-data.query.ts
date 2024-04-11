import type { CryptoCurrencies } from '@leather-wallet/models';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { marketDataQueryOptions } from '../market-data.query';

const currencyNameMap: Record<CryptoCurrencies, string> = {
  BTC: 'bitcoin',
  STX: 'stacks',
};

async function fetchCoincapMarketData(currency: CryptoCurrencies) {
  const resp = await axios.get(`https://api.coincap.io/v2/assets/${currencyNameMap[currency]}`);
  return resp.data;
}

export function selectCoincapUsdPrice(resp: any) {
  return resp?.data?.priceUsd;
}
export function useCoincapMarketDataQuery(currency: CryptoCurrencies) {
  return useQuery({
    queryFn: () => fetchCoincapMarketData(currency),
    queryKey: [`coincap-market-data-${currency}`],
    ...marketDataQueryOptions,
  });
}
