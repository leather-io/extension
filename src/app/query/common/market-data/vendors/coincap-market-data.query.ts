import { useQuery } from '@tanstack/react-query';

import { CryptoCurrency } from '@leather.io/models';
import { fetchCoincapMarketData, marketDataQueryOptions } from '@leather.io/query';

export function useCoincapMarketDataQuery(currency: CryptoCurrency) {
  return useQuery({
    queryFn: () => fetchCoincapMarketData(currency),
    queryKey: [`coincap-market-data-${currency}`],
    ...marketDataQueryOptions,
  });
}
