import BigNumber from 'bignumber.js';

import { calculateMeanAverage } from '@app/common/calculate-averages';

import {
  selectBinanceUsdPrice,
  useBinanceMarketDataQuery,
} from './vendors/binance-market-data.query';
import {
  selectCoincapUsdPrice,
  useCoincapMarketDataQuery,
} from './vendors/coincap-market-data.query';
import {
  selectCoingeckoUsdPrice,
  useCoinGeckoMarketDataQuery,
} from './vendors/coingecko-market-data.query';
import { MarketPair } from '@shared/models/currencies.model';

interface MarketDataVendorWithPriceSelector {
  result: unknown;
  selector(v: unknown): string | number;
}
function pullPriceDataFromAvailableResponses(responses: MarketDataVendorWithPriceSelector[]) {
  return responses
    .filter(({ result }) => !!result)
    .map(({ result, selector: priceSelector }) => priceSelector(result))
    .map(val => new BigNumber(val));
}

export function useStxMarketPrice(): MarketPair {
  const { data: coingecko } = useCoinGeckoMarketDataQuery('STX');
  const { data: coincap } = useCoincapMarketDataQuery('STX');
  const { data: binance } = useBinanceMarketDataQuery('STX');

  const stxPriceData = pullPriceDataFromAvailableResponses([
    { result: coingecko, selector: selectCoingeckoUsdPrice },
    { result: coincap, selector: selectCoincapUsdPrice },
    { result: binance, selector: selectBinanceUsdPrice },
  ]);

  const meanStxPrice = calculateMeanAverage(stxPriceData);

  return { base: 'STX', quote: 'USD', price: meanStxPrice };
}
