import { useMemo } from 'react';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { createBitcoinCryptoCurrencyAssetTypeWrapper } from '@app/query/bitcoin/address/address.utils';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';

export function useBtcAssetBalance(btcAddress: string) {
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const {
    btcBalance: btcAssetBalance,
    isLoading,
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
      isInitialLoading,
    }),
    [btcAddress, btcAssetBalance, btcMarketData, isLoading, isInitialLoading]
  );
}
