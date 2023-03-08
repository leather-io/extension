import { useMemo } from 'react';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useStacksAnchoredCryptoCurrencyAssetBalance } from '@app/query/stacks/balance/stacks-ft-balances.hooks';

export function useStxAssetBalance(address: string) {
  const stxMarketData = useCryptoCurrencyMarketData('STX');
  const { data: balance, isLoading } = useStacksAnchoredCryptoCurrencyAssetBalance(address);

  return useMemo(
    () => ({
      isLoading,
      stxAssetBalance: balance,
      stxUsdBalance: balance
        ? i18nFormatCurrency(baseCurrencyAmountInQuote(balance.balance, stxMarketData))
        : undefined,
    }),
    [balance, isLoading, stxMarketData]
  );
}
