import { useMemo } from 'react';

import {
  createBitcoinCryptoCurrencyAssetTypeWrapper,
  useNativeSegwitBalance,
} from '@leather-wallet/query';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';

export function useBtcAssetBalance(btcAddress: string) {
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const {
    btcBalance: btcAssetBalance,
    isLoading,
    isFetching,
    isInitialLoading,
  } = useNativeSegwitBalance(btcAddress);

  return useMemo(
    () => ({
      btcAddress,
      btcAssetBalance,
      btcUsdBalance: i18nFormatCurrency(
        baseCurrencyAmountInQuote(btcAssetBalance.balance, btcMarketData)
      ),
      btcAvailableAssetBalance: createBitcoinCryptoCurrencyAssetTypeWrapper(
        btcAssetBalance.balance
      ),
      btcAvailableUsdBalance: i18nFormatCurrency(
        baseCurrencyAmountInQuote(btcAssetBalance.balance, btcMarketData)
      ),
      isLoading,
      isFetching,
      isInitialLoading,
    }),
    [btcAddress, btcAssetBalance, btcMarketData, isLoading, isInitialLoading, isFetching]
  );
}
