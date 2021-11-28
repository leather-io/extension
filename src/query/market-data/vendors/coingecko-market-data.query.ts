import { useMarketDataQueryFactory } from '../market-data.query';

export function selectCoingeckoStxPrice(resp: any) {
  return resp?.blockstack?.usd;
}
export function useCoinGeckoStxMarketDataQuery() {
  return useMarketDataQueryFactory({
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd',
    queryKey: 'coin-gecko-market-data',
  });
}
