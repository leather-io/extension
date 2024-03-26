import { useMemo } from 'react';

import { createMoney } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useStacksAccountBalances } from '@app/query/stacks/balance/stx-balance.hooks';

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
  const { data: balances, isLoading } = useStacksAccountBalances(stxAddress);
  const stxBalance = balances ? balances.stx.balance : createMoney(0, 'STX');

  // get btc balance
  const btcBalance = useBtcAssetBalance(btcAddress);

  return useMemo(() => {
    // calculate total balance
    const stxUsdAmount = baseCurrencyAmountInQuote(stxBalance, stxMarketData);
    const btcUsdAmount = baseCurrencyAmountInQuote(
      btcBalance.btcAvailableAssetBalance.balance,
      btcMarketData
    );

    const totalBalance = { ...stxUsdAmount, amount: stxUsdAmount.amount.plus(btcUsdAmount.amount) };
    return {
      totalBalance,
      totalUsdBalance: i18nFormatCurrency(
        totalBalance,
        totalBalance.amount.isGreaterThanOrEqualTo(100_000) ? 0 : 2
      ),
      isLoading,
    };
  }, [btcBalance, btcMarketData, stxMarketData, isLoading, stxBalance]);
}
