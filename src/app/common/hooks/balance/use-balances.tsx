import { useMemo } from 'react';

import {
  useCryptoCurrencyMarketDataMeanAverage,
  useStxCryptoAssetBalance,
} from '@leather.io/query';
import { baseCurrencyAmountInQuote, createMoney, i18nFormatCurrency } from '@leather.io/utils';

import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

import { useSip10ManagedTokensBalance } from './use-sip10-balance';

const highBalance = createMoney(100_000, 'USD');

interface UseBalanceArgs {
  btcAddress: string;
  stxAddress: string;
}
export function useBalances({ btcAddress, stxAddress }: UseBalanceArgs) {
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

  const totalStxBalance = balance ? balance.totalBalance : createMoney(0, 'STX');
  const availableUnlockedStxBalance = balance
    ? balance.availableUnlockedBalance
    : createMoney(0, 'STX');

  // get btc balance
  const {
    balance: btcBalance,
    isLoading: isLoadingBtcBalance,
    filteredUtxosQuery: { isFetching: isFetchingBtcBalance, isPending: isPendingBtcBalance },
    isLoadingAdditionalData: isLoadingAdditionalDataBtcBalance,
  } = useBtcCryptoAssetBalanceNativeSegwit(btcAddress);

  // get sip10 balance
  const sip10BalanceUsd = useSip10ManagedTokensBalance({ stxAddress, assetFilter: 'enabled' });

  return useMemo(() => {
    // calculate total balance
    const totalStxUsdAmount = baseCurrencyAmountInQuote(totalStxBalance, stxMarketData);
    // calculate available unlocked balance
    const availableUnlockedStxUsdAmount = baseCurrencyAmountInQuote(
      availableUnlockedStxBalance,
      stxMarketData
    );

    const availableBtcUsdAmount = baseCurrencyAmountInQuote(
      btcBalance.availableBalance,
      btcMarketData
    );

    const totalBtcUsdAmount = baseCurrencyAmountInQuote(btcBalance.totalBalance, btcMarketData);

    const totalBalance = {
      ...totalStxUsdAmount,
      amount: totalStxUsdAmount.amount.plus(totalBtcUsdAmount.amount).plus(sip10BalanceUsd.amount),
    };

    const availableBalance = {
      ...availableUnlockedStxUsdAmount,
      amount: availableUnlockedStxUsdAmount.amount
        .plus(availableBtcUsdAmount.amount)
        .plus(sip10BalanceUsd.amount),
    };

    return {
      isFetching: isFetchingStxBalance || isFetchingBtcBalance,
      isLoading: isLoadingStxBalance || isLoadingBtcBalance,
      isPending:
        (isPendingStxBalance && Boolean(stxAddress)) ||
        (isPendingBtcBalance && Boolean(btcAddress)),
      totalBalance,
      availableBalance,
      availableUsdBalance: i18nFormatCurrency(
        availableBalance,
        availableBalance.amount.isGreaterThanOrEqualTo(highBalance.amount) ? 0 : 2
      ),
      totalUsdBalance: i18nFormatCurrency(
        totalBalance,
        totalBalance.amount.isGreaterThanOrEqualTo(highBalance.amount) ? 0 : 2
      ),
      isLoadingAdditionalData:
        isLoadingAdditionalDataStxBalance || isLoadingAdditionalDataBtcBalance,
    };
  }, [
    totalStxBalance,
    stxMarketData,
    availableUnlockedStxBalance,
    btcBalance.availableBalance,
    btcBalance.totalBalance,
    btcMarketData,
    sip10BalanceUsd.amount,
    isFetchingStxBalance,
    isFetchingBtcBalance,
    isLoadingStxBalance,
    isLoadingBtcBalance,
    isPendingStxBalance,
    stxAddress,
    isPendingBtcBalance,
    btcAddress,
    isLoadingAdditionalDataStxBalance,
    isLoadingAdditionalDataBtcBalance,
  ]);
}
