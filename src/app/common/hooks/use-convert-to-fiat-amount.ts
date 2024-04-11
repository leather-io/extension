import { useCallback, useMemo } from 'react';

import { type CryptoCurrencies, createMarketData, createMarketPair } from '@leather-wallet/models';

import type { Money } from '@shared/models/money.model';

import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

import { baseCurrencyAmountInQuote } from '../money/calculate-money';

export function useConvertCryptoCurrencyToFiatAmount(currency: CryptoCurrencies) {
  const cryptoCurrencyMarketData = useCryptoCurrencyMarketData(currency);

  return useCallback(
    (value: Money) => baseCurrencyAmountInQuote(value, cryptoCurrencyMarketData),
    [cryptoCurrencyMarketData]
  );
}

export function useConvertAlexSdkCurrencyToFiatAmount(currency: CryptoCurrencies, price: Money) {
  const alexCurrencyMarketData = useMemo(
    () => createMarketData(createMarketPair(currency, 'USD'), price),
    [currency, price]
  );

  return useCallback(
    (value: Money) => baseCurrencyAmountInQuote(value, alexCurrencyMarketData),
    [alexCurrencyMarketData]
  );
}
