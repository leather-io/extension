import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { type AccountRequest, getAccountBalancesService } from '@leather.io/services';

import { useCurrentNetworkState } from '@app/query/leather-query-provider';
import { toFetchState } from '@app/services/fetch-state';
import { useAccountAddresses } from '@app/services/use-account-addresses';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useUserAllTokens } from '@app/store/manage-tokens/manage-tokens.slice';

import { balanceQueryOptions } from '../balance-query-options';

export function useCurrentAccountTotalBalance() {
  const accountIndex = useCurrentAccountIndex();
  return useAccountTotalBalance(accountIndex);
}

export function useAccountTotalBalance(accountIndex: number) {
  const account = useAccountAddresses(accountIndex);
  return toFetchState(
    useGetAccountTotalBalanceQuery({
      account,
    })
  );
}

function useGetAccountTotalBalanceQuery(request: AccountRequest) {
  const network = useCurrentNetworkState();
  const tokenSettings = useUserAllTokens();
  return useQuery({
    queryKey: ['account-balances-service-get-total-balance', request, network.id, tokenSettings],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getAccountBalancesService().getTotalBalance(request, signal),
    ...balanceQueryOptions,
  });
}
