import { type QueryFunctionContext, keepPreviousData, useQuery } from '@tanstack/react-query';

import { type AccountRequest, getSip10BalancesService } from '@leather.io/services';

import {
  balanceQueryOptions,
  balanceQueryOptionsWithRefetch,
} from '@app/query/common/balance-query-options';
import { useUserAllTokens } from '@app/store/manage-tokens/manage-tokens.slice';

export function useGetSip10AccountBalanceQuery(account: AccountRequest) {
  const tokenSettings = useUserAllTokens();
  return useQuery({
    queryKey: ['sip10-balances-service-get-sip10-account-balance', account, tokenSettings],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getSip10BalancesService().getSip10AccountBalance(account, signal),
    ...balanceQueryOptionsWithRefetch,
    placeholderData: keepPreviousData,
  });
}

export function useGetSip10AddressBalanceQuery(address: string) {
  const tokenSettings = useUserAllTokens();
  return useQuery({
    queryKey: ['sip10-balances-service-get-sip10-address-balance', address, tokenSettings],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getSip10BalancesService().getSip10AddressBalance(address, false, signal),
    ...balanceQueryOptions,
  });
}
