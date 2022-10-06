import { useQuery } from '@tanstack/react-query';

import { fetchJson } from '@app/common/utils';
import { CryptoCurrencies } from '@shared/models/currencies.model';
import { marketDataQueryOptions } from '../market-data.query';

const currencyNameMap: Record<CryptoCurrencies, string> = {
  STX: 'blockstack',
};

function fetchCoingeckoMarketData(currency: CryptoCurrencies) {
  return fetchJson(
    `https://api.coingecko.com/api/v3/simple/price?ids=${currencyNameMap[currency]}&vs_currencies=usd`
  );
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
