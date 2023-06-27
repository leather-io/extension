import { useMemo } from 'react';

import { createMoney } from '@shared/models/money.model';
import { isDefined } from '@shared/utils';

import { baseCurrencyAmountInQuote, subtractMoney } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { createStacksCryptoCurrencyAssetTypeWrapper } from '@app/query/stacks/balance/stacks-ft-balances.utils';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/stx-balance.hooks';

import { useStxOutboundValue } from './use-stx-outbound-value';

export function useStxBalance() {
  const anchoredBalanceQuery = useCurrentStacksAccountAnchoredBalances();
  const totalBalance = anchoredBalanceQuery.data?.stx.balance;
  const unlockedStxBalance = anchoredBalanceQuery.data?.stx.unlockedStx;

  const stxMarketData = useCryptoCurrencyMarketData('STX');
  const stxOutboundQuery = useStxOutboundValue();

  const stxEffectiveBalance = isDefined(totalBalance)
    ? subtractMoney(totalBalance, stxOutboundQuery.data)
    : createMoney(0, 'STX');

  const stxEffectiveUsdBalance = isDefined(totalBalance)
    ? i18nFormatCurrency(baseCurrencyAmountInQuote(stxEffectiveBalance, stxMarketData))
    : undefined;

  const stxLockedBalance = anchoredBalanceQuery.data?.stx.locked;
  const stxUsdLockedBalance = isDefined(stxLockedBalance)
    ? i18nFormatCurrency(baseCurrencyAmountInQuote(stxLockedBalance, stxMarketData))
    : undefined;

  return useMemo(() => {
    return {
      anchoredBalanceQuery,
      stxOutboundQuery,
      isLoading: anchoredBalanceQuery.isLoading || stxOutboundQuery.isLoading,
      availableBalance: isDefined(unlockedStxBalance)
        ? subtractMoney(unlockedStxBalance, stxOutboundQuery.data)
        : createMoney(0, 'STX'),
      stxEffectiveBalance: createStacksCryptoCurrencyAssetTypeWrapper(stxEffectiveBalance.amount),
      stxEffectiveUsdBalance,
      stxLockedBalance,
      stxUsdLockedBalance,
    };
  }, [
    anchoredBalanceQuery,
    stxOutboundQuery,
    unlockedStxBalance,
    stxEffectiveBalance,
    stxEffectiveUsdBalance,
    stxLockedBalance,
    stxUsdLockedBalance,
  ]);
}
