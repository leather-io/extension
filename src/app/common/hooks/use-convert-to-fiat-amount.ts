import { useCallback } from 'react';

import type { CryptoCurrency, Money } from '@leather.io/models';
import { baseCurrencyAmountInQuote } from '@leather.io/utils';

import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';

export function useConvertCryptoCurrencyToFiatAmount(currency: CryptoCurrency) {
  // TODO: unsafe type assumption
  const cryptoCurrencyMarketData = useCryptoCurrencyMarketDataMeanAverage(
    currency as 'BTC' | 'STX'
  );

  return useCallback(
    (value: Money) => baseCurrencyAmountInQuote(value, cryptoCurrencyMarketData),
    [cryptoCurrencyMarketData]
  );
}
