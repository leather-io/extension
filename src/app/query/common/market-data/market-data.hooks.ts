import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { calculateMeanAverage } from '@app/common/calculate-averages';
import { createMoney, currencydecimalsMap } from '@shared/models/money.model';
import { createMarketData, createMarketPair, MarketData } from '@shared/models/market.model';
import { convertAmountToFractionalUnit } from '@app/common/money/calculate-money';

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

interface MarketDataVendorWithPriceSelector {
  result: unknown;
  selector(v: unknown): string | number;
}
function pullPriceDataFromAvailableResponses(responses: MarketDataVendorWithPriceSelector[]) {
  return responses
    .filter(({ result }) => !!result)
    .map(({ result, selector: priceSelector }) => priceSelector(result))
    .map(val => new BigNumber(val))
    .map(val => convertAmountToFractionalUnit(val, currencydecimalsMap.USD));
}

export function useStxMarketData(): MarketData {
  const { data: coingecko } = useCoinGeckoMarketDataQuery('STX');
  const { data: coincap } = useCoincapMarketDataQuery('STX');
  const { data: binance } = useBinanceMarketDataQuery('STX');

  return useMemo(() => {
    const stxPriceData = pullPriceDataFromAvailableResponses([
      { result: coingecko, selector: selectCoingeckoUsdPrice },
      { result: coincap, selector: selectCoincapUsdPrice },
      { result: binance, selector: selectBinanceUsdPrice },
    ]);
    const meanStxPrice = calculateMeanAverage(stxPriceData);

    return createMarketData(createMarketPair('STX', 'USD'), createMoney(meanStxPrice, 'USD'));
  }, [binance, coincap, coingecko]);
}
