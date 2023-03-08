import { useMemo } from 'react';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/stx-balance.hooks';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

export function useTotalBalance() {
  // get market data
  const btcMarketData = useCryptoCurrencyMarketData('BTC');
  const stxMarketData = useCryptoCurrencyMarketData('STX');

  // get stx balance
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();

  // get btc balance
  const btcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
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
    };
  }, [btcBalance, balances, btcMarketData, stxMarketData]);
}
