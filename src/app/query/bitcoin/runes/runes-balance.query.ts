import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';

import {
  type AccountRequest,
  type RuneBalance,
  getRunesBalancesService,
} from '@leather.io/services';
import {
  aggregateBaseCryptoAssetBalances,
  createBaseCryptoAssetBalance,
  createMoney,
} from '@leather.io/utils';

import { type AssetFilter, useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { balanceQueryOptionsWithRefetch } from '@app/query/common/balance-query-options';
import { toFetchState } from '@app/services/fetch-state';
import { useAccountAddresses } from '@app/services/use-account-addresses';

export function useManagedRunesAccountBalance(accountIndex: number, assetFilter: AssetFilter) {
  const balance = useRunesAccountBalance(accountIndex);
  const { filterTokens, isTokenEnabled } = useManageTokens();

  if (balance.state !== 'success') {
    return {
      isLoading: true,
    };
  }

  const managedTokens = filterTokens({
    tokens: balance.value.runes,
    filter: assetFilter,
    getTokenId: t => t.asset.runeName,
    preEnabledTokensIds: [],
  });

  return {
    isLoading: false,
    runes: managedTokens,
    balance:
      managedTokens.length > 0
        ? aggregateBaseCryptoAssetBalances(managedTokens.map(t => t.quote))
        : createBaseCryptoAssetBalance(createMoney(0, 'USD')),
    isEnabled: (rune: RuneBalance) =>
      isTokenEnabled({ tokenId: rune.asset.runeName, preEnabledTokensIds: [] }),
  };
}

function useRunesAccountBalance(accountIndex: number) {
  const account = useAccountAddresses(accountIndex);
  return toFetchState(useGetRunesAccountBalanceQuery({ account }));
}

function useGetRunesAccountBalanceQuery(request: AccountRequest) {
  return useQuery({
    queryKey: ['runes-balances-service-get-runes-account-balance', request.account.bitcoin],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getRunesBalancesService().getRunesAccountBalance(request, signal),
    ...balanceQueryOptionsWithRefetch,
  });
}
