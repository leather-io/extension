import { useQuery } from '@tanstack/react-query';

import { CryptoCurrency } from '@leather.io/models';
import { fetchCoingeckoMarketData, marketDataQueryOptions } from '@leather.io/query';

export function useCoinGeckoMarketDataQuery(currency: CryptoCurrency) {
  return useQuery({
    queryFn: () => fetchCoingeckoMarketData(currency),
    queryKey: [`coin-gecko-market-data-${currency}`],
    ...marketDataQueryOptions,
  });
}
