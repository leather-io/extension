import { useCallback } from 'react';

import { useCryptoCurrencyMarketDataMeanAverage } from '@leather-wallet/query';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { type Money } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '../money/calculate-money';

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
