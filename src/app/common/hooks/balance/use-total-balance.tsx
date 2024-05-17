import { useMemo } from 'react';

import { createMoney } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { useStxCryptoAssetBalance } from '@app/query/stacks/balance/account-balance.hooks';

interface UseTotalBalanceArgs {
  btcAddress: string;
  stxAddress: string;
}
export function useTotalBalance({ btcAddress, stxAddress }: UseTotalBalanceArgs) {
  // get market data
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');

  // get stx balance
  const {
    data: balance,
    isLoading,
    isInitialLoading,
    isFetching: isFetchingStacksBalance,
  } = useStxCryptoAssetBalance(stxAddress);
  const stxBalance = balance ? balance.totalBalance : createMoney(0, 'STX');

  // get btc balance
  const {
    btcCryptoAssetBalance,
    isLoading: isLoadingBtcBalance,
    isFetching: isFetchingBtcBalance,
    isInitialLoading: isInititalLoadingBtcBalance,
  } = useBtcCryptoAssetBalanceNativeSegwit(btcAddress);

  return useMemo(() => {
    // calculate total balance
    const stxUsdAmount = baseCurrencyAmountInQuote(stxBalance, stxMarketData);
    const btcUsdAmount = baseCurrencyAmountInQuote(
      btcCryptoAssetBalance.availableBalance,
      btcMarketData
    );

    const totalBalance = { ...stxUsdAmount, amount: stxUsdAmount.amount.plus(btcUsdAmount.amount) };
    return {
      totalBalance,
      totalUsdBalance: i18nFormatCurrency(
        totalBalance,
        totalBalance.amount.isGreaterThanOrEqualTo(100_000) ? 0 : 2
      ),
      isLoading: isLoading || isLoadingBtcBalance,
      isInitialLoading: isInitialLoading || isInititalLoadingBtcBalance,
      isFetching: isFetchingStacksBalance || isFetchingBtcBalance,
    };
  }, [
    stxBalance,
    stxMarketData,
    btcCryptoAssetBalance.availableBalance,
    btcMarketData,
    isLoading,
    isLoadingBtcBalance,
    isInitialLoading,
    isInititalLoadingBtcBalance,
    isFetchingStacksBalance,
    isFetchingBtcBalance,
  ]);
}
