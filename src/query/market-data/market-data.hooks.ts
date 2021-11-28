import BigNumber from 'bignumber.js';

import { calculateMeanAverage } from '@common/utils/calculate-averages';
import {
  selectBinanceStxPrice,
  useBinanceStxMarketDataQuery,
} from './vendors/binance-market-data.query';
import {
  selectCoincapStxPrice,
  useCoincapStxMarketDataQuery,
} from './vendors/coincap-market-data.query';
import {
  selectCoingeckoStxPrice,
  useCoinGeckoStxMarketDataQuery,
} from './vendors/coingecko-market-data.query';

interface MarketDataVendorWithPriceSelector {
  result: any;
  selector(v: unknown): string | number;
}
function pullPriceDataFromAvailableResponses(responses: MarketDataVendorWithPriceSelector[]) {
  return responses
    .filter(({ result }) => !!result)
    .map(({ result, selector: priceSelector }) => priceSelector(result))
    .map(val => new BigNumber(val));
}

export function useStxMarketPrice() {
  const { data: coingecko } = useCoinGeckoStxMarketDataQuery();
  const { data: coincap } = useCoincapStxMarketDataQuery();
  const { data: binance } = useBinanceStxMarketDataQuery();

  const stxPriceData = pullPriceDataFromAvailableResponses([
    { result: coingecko, selector: selectCoingeckoStxPrice },
    { result: coincap, selector: selectCoincapStxPrice },
    { result: binance, selector: selectBinanceStxPrice },
  ]);

  const meanStxPrice = calculateMeanAverage(stxPriceData).toString();
  return { symbol: 'USD', value: meanStxPrice };
}
