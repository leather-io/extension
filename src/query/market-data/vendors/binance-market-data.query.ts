import { useMarketDataQueryFactory } from '../market-data.query';

export function selectBinanceStxPrice(resp: any) {
  return resp?.price;
}
export function useBinanceStxMarketDataQuery() {
  return useMarketDataQueryFactory({
    url: 'https://api1.binance.com/api/v3/ticker/price?symbol=STXUSDT',
    queryKey: 'binance-stx-market-data',
  });
}
