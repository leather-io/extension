import { useQuery } from '@tanstack/react-query';

import { CryptoCurrencies } from '@shared/models/currencies.model';

import { logAndThrow } from '@app/common/utils';

import { marketDataQueryOptions } from '../market-data.query';

const currencyNameMap: Record<CryptoCurrencies, string> = {
  BTC: 'bitcoin',
  STX: 'stacks',
};

async function fetchCoincapMarketData(currency: CryptoCurrencies) {
  const resp = await fetch(`https://api.coincap.io/v2/assets/${currencyNameMap[currency]}`);
  if (!resp.ok) logAndThrow('Cannot load coincap data');
  return resp.json();
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
