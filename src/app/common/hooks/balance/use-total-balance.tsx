import { useMemo } from 'react';

import {
  useCryptoCurrencyMarketDataMeanAverage,
  useStxCryptoAssetBalance,
} from '@leather.io/query';
import { baseCurrencyAmountInQuote, createMoney, i18nFormatCurrency } from '@leather.io/utils';

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
  const { filteredBalanceQuery, isLoadingAdditionalData: isLoadingAdditionalDataStxBalance } =
    useStxCryptoAssetBalance(stxAddress);

  const {
    data: balance,
    isFetching: isFetchingStxBalance,
    isLoading: isLoadingStxBalance,
    isPending: isPendingStxBalance,
  } = filteredBalanceQuery;

  const stxBalance = balance ? balance.totalBalance : createMoney(0, 'STX');

  // get btc balance
  const {
    balance: btcBalance,
    isLoading: isLoadingBtcBalance,
    filteredUtxosQuery: { isFetching: isFetchingBtcBalance, isPending: isPendingBtcBalance },
    isLoadingAdditionalData: isLoadingAdditionalDataBtcBalance,
  } = useBtcCryptoAssetBalanceNativeSegwit(btcAddress);

  return useMemo(() => {
    // calculate total balance
    const stxUsdAmount = baseCurrencyAmountInQuote(stxBalance, stxMarketData);
    const btcUsdAmount = baseCurrencyAmountInQuote(btcBalance.availableBalance, btcMarketData);

    const totalBalance = { ...stxUsdAmount, amount: stxUsdAmount.amount.plus(btcUsdAmount.amount) };
    return {
      isFetching: isFetchingStxBalance || isFetchingBtcBalance,
      isLoading: isLoadingStxBalance || isLoadingBtcBalance,
      isPending: isPendingStxBalance || isPendingBtcBalance,
      totalBalance,
      totalUsdBalance: i18nFormatCurrency(
        totalBalance,
        totalBalance.amount.isGreaterThanOrEqualTo(100_000) ? 0 : 2
      ),
      isLoadingAdditionalData:
        isLoadingAdditionalDataStxBalance || isLoadingAdditionalDataBtcBalance,
    };
  }, [
    btcBalance.availableBalance,
    btcMarketData,
    isFetchingBtcBalance,
    isFetchingStxBalance,
    isLoadingBtcBalance,
    isLoadingStxBalance,
    isPendingBtcBalance,
    isPendingStxBalance,
    stxBalance,
    stxMarketData,
    isLoadingAdditionalDataBtcBalance,
    isLoadingAdditionalDataStxBalance,
  ]);
}
