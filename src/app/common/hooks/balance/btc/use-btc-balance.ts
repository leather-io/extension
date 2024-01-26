import { useMemo } from 'react';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { createBitcoinCryptoCurrencyAssetTypeWrapper } from '@app/query/bitcoin/address/address.utils';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

export function useBtcAssetBalance(btcAddress: string) {
  const btcMarketData = useCryptoCurrencyMarketData('BTC');
  const btcAssetBalance = useNativeSegwitBalance(btcAddress);

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
    }),
    [btcAddress, btcAssetBalance, btcMarketData]
  );
}
