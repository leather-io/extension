import { useQuery } from '@tanstack/react-query';

import { fetchJson } from '@app/common/utils';
import { CryptoCurrencies } from '@shared/models/currencies.model';
import { marketDataQueryOptions } from '../market-data.query';

const currencyNameMap: Record<CryptoCurrencies, string> = {
  STX: 'stacks',
};

function fetchCoincapMarketData(currency: CryptoCurrencies) {
  return fetchJson(`https://api.coincap.io/v2/assets/${currencyNameMap[currency]}`);
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
