import { useMemo } from 'react';

import { baseCurrencyAmountInQuote, subtractMoney } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { createBitcoinCryptoCurrencyAssetTypeWrapper } from '@app/query/bitcoin/address/address.utils';
import { useBitcoinPendingTransactionsBalance } from '@app/query/bitcoin/address/transactions-by-address.hooks';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

export function useBtcAssetBalance(btcAddress: string) {
  const btcMarketData = useCryptoCurrencyMarketData('BTC');
  const btcAssetBalance = useNativeSegwitBalance(btcAddress);
  const pendingBalance = useBitcoinPendingTransactionsBalance(btcAddress);
  const availableBalance = subtractMoney(btcAssetBalance.balance, pendingBalance);

  return useMemo(
    () => ({
      btcAddress,
      btcAssetBalance,
      btcUsdBalance: i18nFormatCurrency(
        baseCurrencyAmountInQuote(btcAssetBalance.balance, btcMarketData)
      ),
      btcAvailableAssetBalance: createBitcoinCryptoCurrencyAssetTypeWrapper(availableBalance),
      btcAvailableUsdBalance: i18nFormatCurrency(
        baseCurrencyAmountInQuote(availableBalance, btcMarketData)
      ),
    }),
    [btcAddress, btcAssetBalance, btcMarketData, availableBalance]
  );
}
