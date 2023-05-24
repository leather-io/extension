import { useMemo } from 'react';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useAnchoredStacksAccountBalances } from '@app/query/stacks/balance/stx-balance.hooks';

import { useBtcAssetBalance } from './btc/use-btc-balance';

interface UseTotalBalanceArgs {
  btcAddress: string;
  stxAddress: string;
}

export function useTotalBalance({ btcAddress, stxAddress }: UseTotalBalanceArgs) {
  // get market data
  const btcMarketData = useCryptoCurrencyMarketData('BTC');
  const stxMarketData = useCryptoCurrencyMarketData('STX');

  // get stx balance
  const { data: balances, isLoading } = useAnchoredStacksAccountBalances(stxAddress);

  // get btc balance
  const btcBalance = useBtcAssetBalance(btcAddress);

  return useMemo(() => {
    if (!balances) return null;

    // calculate total balance
    const stxUsdAmount = baseCurrencyAmountInQuote(balances.stx.balance, stxMarketData);
    const btcUsdAmount = baseCurrencyAmountInQuote(
      btcBalance.btcAvailableAssetBalance.balance,
      btcMarketData
    );

    const totalBalance = { ...stxUsdAmount, amount: stxUsdAmount.amount.plus(btcUsdAmount.amount) };
    return {
      totalBalance,
      totalUsdBalance: i18nFormatCurrency(totalBalance),
      isLoading,
    };
  }, [btcBalance, balances, btcMarketData, stxMarketData, isLoading]);
}
