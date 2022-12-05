import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { MarketData, createMarketData, createMarketPair } from '@shared/models/market.model';
import { createMoney, currencydecimalsMap } from '@shared/models/money.model';

import { calculateMeanAverage } from '@app/common/calculate-averages';
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

export function useCryptoCurrencyMarketData(currency: CryptoCurrencies): MarketData {
  const { data: coingecko } = useCoinGeckoMarketDataQuery(currency);
  const { data: coincap } = useCoincapMarketDataQuery(currency);
  const { data: binance } = useBinanceMarketDataQuery(currency);

  return useMemo(() => {
    const stxPriceData = pullPriceDataFromAvailableResponses([
      { result: coingecko, selector: selectCoingeckoUsdPrice },
      { result: coincap, selector: selectCoincapUsdPrice },
      { result: binance, selector: selectBinanceUsdPrice },
    ]);
    const meanStxPrice = calculateMeanAverage(stxPriceData);

    return createMarketData(createMarketPair(currency, 'USD'), createMoney(meanStxPrice, 'USD'));
  }, [binance, coincap, coingecko, currency]);
}
