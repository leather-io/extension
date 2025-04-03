import { useQuery } from '@tanstack/react-query';

import { CryptoCurrency } from '@leather.io/models';
import { fetchBinanceMarketData, marketDataQueryOptions } from '@leather.io/query';

export function useBinanceMarketDataQuery(currency: CryptoCurrency) {
  return useQuery({
    queryFn: () => fetchBinanceMarketData(currency),
    queryKey: [`binance-market-data-${currency}`],
    ...marketDataQueryOptions,
  });
}
