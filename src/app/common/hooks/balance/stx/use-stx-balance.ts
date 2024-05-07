import { useMemo } from 'react';

import { useCryptoCurrencyMarketDataMeanAverage } from '@leather-wallet/query';

import { createMoney } from '@shared/models/money.model';
import { isDefined } from '@shared/utils';

import { baseCurrencyAmountInQuote, subtractMoney } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { createStacksCryptoCurrencyAssetTypeWrapper } from '@app/query/stacks/balance/stacks-ft-balances.utils';
import { useCurrentStacksAccountBalances } from '@app/query/stacks/balance/stx-balance.hooks';
import { useCurrentAccountMempoolTransactionsBalance } from '@app/query/stacks/mempool/mempool.hooks';

export function useStxBalance() {
  const stxBalanceQuery = useCurrentStacksAccountBalances();
  const totalBalance = stxBalanceQuery.data?.stx.balance;
  const unlockedStxBalance = stxBalanceQuery.data?.stx.unlockedStx;

  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage('STX');
  const pendingTxsBalance = useCurrentAccountMempoolTransactionsBalance();

  const stxEffectiveBalance = isDefined(totalBalance)
    ? subtractMoney(totalBalance, pendingTxsBalance)
    : createMoney(0, 'STX');

  const stxEffectiveUsdBalance = isDefined(totalBalance)
    ? i18nFormatCurrency(baseCurrencyAmountInQuote(stxEffectiveBalance, stxMarketData))
    : undefined;

  const stxLockedBalance = stxBalanceQuery.data?.stx.locked;
  const stxUsdLockedBalance = isDefined(stxLockedBalance)
    ? i18nFormatCurrency(baseCurrencyAmountInQuote(stxLockedBalance, stxMarketData))
    : undefined;

  return useMemo(() => {
    return {
      stxBalanceQuery,
      stxOutboundQuery: pendingTxsBalance,
      availableBalance: isDefined(unlockedStxBalance)
        ? subtractMoney(unlockedStxBalance, pendingTxsBalance)
        : createMoney(0, 'STX'),
      stxEffectiveBalance: createStacksCryptoCurrencyAssetTypeWrapper(stxEffectiveBalance.amount),
      stxEffectiveUsdBalance,
      stxLockedBalance,
      stxUsdLockedBalance,
    };
  }, [
    stxBalanceQuery,
    pendingTxsBalance,
    unlockedStxBalance,
    stxEffectiveBalance.amount,
    stxEffectiveUsdBalance,
    stxLockedBalance,
    stxUsdLockedBalance,
  ]);
}
