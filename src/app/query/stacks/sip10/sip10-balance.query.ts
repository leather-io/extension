import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { type AccountRequest, getSip10BalancesService } from '@leather.io/services';

import {
  balanceQueryOptions,
  balanceQueryOptionsWithRefetch,
} from '@app/query/common/balance-query-options';

export function useGetSip10AccountBalanceQuery(account: AccountRequest) {
  return useQuery({
    queryKey: ['sip10-balances-service-get-sip10-account-balance', account],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getSip10BalancesService().getSip10AccountBalance(account, signal),
    ...balanceQueryOptionsWithRefetch,
  });
}

export function useGetSip10AddressBalanceQuery(address: string) {
  return useQuery({
    queryKey: ['sip10-balances-service-get-sip10-address-balance', address],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getSip10BalancesService().getSip10AddressBalance(address, {}, signal),
    ...balanceQueryOptions,
  });
}
