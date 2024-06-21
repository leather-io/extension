import { useCallback } from 'react';

import type { CryptoCurrencies, Money } from '@leather.io/models';
import { useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';
import { baseCurrencyAmountInQuote } from '@leather.io/utils';

export function useConvertCryptoCurrencyToFiatAmount(currency: CryptoCurrencies) {
  // TODO: unsafe type assumption
  const cryptoCurrencyMarketData = useCryptoCurrencyMarketDataMeanAverage(
    currency as 'BTC' | 'STX'
  );

  return useCallback(
    (value: Money) => baseCurrencyAmountInQuote(value, cryptoCurrencyMarketData),
    [cryptoCurrencyMarketData]
  );
}
