import { useCallback } from 'react';

import type { Money } from '@shared/models/money.model';

import { useStxMarketData } from '@app/query/common/market-data/market-data.hooks';

import { baseCurrencyAmountInQuote } from '../money/calculate-money';

export function useConvertStxToFiatAmount() {
  const stxMarketData = useStxMarketData();
  return useCallback(
    (value: Money) => baseCurrencyAmountInQuote(value, stxMarketData),
    [stxMarketData]
  );
}
