import { useMemo } from 'react';

import { createMoney } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { useStacksAccountBalances } from '@app/query/stacks/balance/stx-balance.hooks';

import { useBtcAssetBalance } from './btc/use-btc-balance';

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
    data: balances,
    isLoading,
    isInitialLoading,
    isFetching: isFetchingStacksBalance,
  } = useStacksAccountBalances(stxAddress);
  const stxBalance = balances ? balances.stx.balance : createMoney(0, 'STX');

  // get btc balance
  const {
    btcAvailableAssetBalance,
    isLoading: isLoadingBtcBalance,
    isFetching: isFetchingBtcBalance,
    isInitialLoading: isInititalLoadingBtcBalance,
  } = useBtcAssetBalance(btcAddress);

  return useMemo(() => {
    // calculate total balance
    const stxUsdAmount = baseCurrencyAmountInQuote(stxBalance, stxMarketData);
    const btcUsdAmount = baseCurrencyAmountInQuote(btcAvailableAssetBalance.balance, btcMarketData);

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
    btcAvailableAssetBalance.balance,
    btcMarketData,
    isInitialLoading,
    isInititalLoadingBtcBalance,
    stxMarketData,
    stxBalance,
    isLoading,
    isLoadingBtcBalance,
    isFetchingStacksBalance,
    isFetchingBtcBalance,
  ]);
}
