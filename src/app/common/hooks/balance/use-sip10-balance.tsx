import { useMemo } from 'react';

import type { Money } from '@leather.io/models';
import {
  baseCurrencyAmountInQuote,
  createMoney,
  isDefined,
  isMoneyGreaterThanZero,
  sumMoney,
} from '@leather.io/utils';

import { useSip10FiatMarketData } from '../use-calculate-sip10-fiat-value';
import { useCombinedFilteredSip10Tokens } from '../use-filtered-sip10-tokens';
import { type AssetFilter, useManageTokens } from '../use-manage-tokens';

interface UseSip10ManagedTokensBalanceArgs {
  stxAddress: string;
  assetFilter?: AssetFilter;
}

export function useSip10ManagedTokensBalance({
  stxAddress,
  assetFilter = 'all',
}: UseSip10ManagedTokensBalanceArgs) {
  const { getTokenMarketData } = useSip10FiatMarketData();
  const { allTokens = [], supportedTokens } = useCombinedFilteredSip10Tokens({
    address: stxAddress,
    filter: 'all',
  });
  const { filterTokens } = useManageTokens();
  const preEnabledTokensIds = supportedTokens.map(t => t.info.contractId);
  const managedTokens = filterTokens({
    tokens: allTokens,
    filter: assetFilter,
    getTokenId: t => t.info.contractId,
    preEnabledTokensIds,
  });

  const balance = useMemo(() => {
    const baseBalance: Money = createMoney(0, 'USD');
    return sumMoney([
      baseBalance,
      ...managedTokens
        .map(token => {
          const tokenMarketData = getTokenMarketData(
            token.info.contractId,
            token.balance.availableBalance.symbol
          );
          if (
            !tokenMarketData ||
            !token.balance.availableBalance ||
            !isMoneyGreaterThanZero(tokenMarketData.price)
          )
            return;
          return baseCurrencyAmountInQuote(token.balance.availableBalance, tokenMarketData);
        })
        .filter(isDefined),
    ]);
  }, [managedTokens, getTokenMarketData]);

  return balance;
}
