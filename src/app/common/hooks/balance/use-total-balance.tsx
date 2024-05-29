import { useMemo } from 'react';

import {
  useCryptoCurrencyMarketDataMeanAverage,
  useStxCryptoAssetBalance,
} from '@leather-wallet/query';
import { baseCurrencyAmountInQuote, createMoney, i18nFormatCurrency } from '@leather-wallet/utils';

import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

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
  const { balance: btcBalance, query: btcQueryResult } =
    useBtcCryptoAssetBalanceNativeSegwit(btcAddress);

  return useMemo(() => {
    // calculate total balance
    const stxUsdAmount = baseCurrencyAmountInQuote(stxBalance, stxMarketData);
    const btcUsdAmount = baseCurrencyAmountInQuote(btcBalance.availableBalance, btcMarketData);

    const totalBalance = { ...stxUsdAmount, amount: stxUsdAmount.amount.plus(btcUsdAmount.amount) };
    return {
      totalBalance,
      totalUsdBalance: i18nFormatCurrency(
        totalBalance,
        totalBalance.amount.isGreaterThanOrEqualTo(100_000) ? 0 : 2
      ),
      isLoading: isLoading || btcQueryResult.isLoading,
      isInitialLoading: isInitialLoading || btcQueryResult.isInitialLoading,
      isFetching: isFetchingStacksBalance || btcQueryResult.isFetching,
    };
  }, [
    stxBalance,
    stxMarketData,
    btcBalance.availableBalance,
    btcMarketData,
    isLoading,
    btcQueryResult.isLoading,
    btcQueryResult.isInitialLoading,
    btcQueryResult.isFetching,
    isInitialLoading,
    isFetchingStacksBalance,
  ]);
}
