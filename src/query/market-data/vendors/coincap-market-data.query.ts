import { useMarketDataQueryFactory } from '../market-data.query';

export function selectCoincapStxPrice(resp: any) {
  return resp?.data?.priceUsd;
}
export function useCoincapStxMarketDataQuery() {
  return useMarketDataQueryFactory({
    url: 'https://api.coincap.io/v2/assets/stacks',
    queryKey: 'coincap-stx-market-data',
  });
}
