import { useMemo } from 'react';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useAnchoredStacksAccountBalances } from '@app/query/stacks/balance/stx-balance.hooks';

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
  const btcBalance = useNativeSegwitBalance(btcAddress);

  return useMemo(() => {
    if (!balances || !btcBalance) return null;

    // calculate total balance
    const stxUsdAmount = baseCurrencyAmountInQuote(balances.stx.availableStx, stxMarketData);
    const btcUsdAmount = baseCurrencyAmountInQuote(btcBalance.balance, btcMarketData);

    const totalBalance = { ...stxUsdAmount, amount: stxUsdAmount.amount.plus(btcUsdAmount.amount) };
    return {
      totalBalance,
      totalUsdBalance: i18nFormatCurrency(totalBalance),
      isLoading,
    };
  }, [btcBalance, balances, btcMarketData, stxMarketData, isLoading]);
}
