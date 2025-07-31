import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { type AccountRequest, getStxBalancesService } from '@leather.io/services';

import {
  balanceQueryOptions,
  balanceQueryOptionsWithRefetch,
} from '@app/query/common/balance-query-options';

export function useGetStxAccountBalanceQuery(account: AccountRequest) {
  return useQuery({
    queryKey: ['stx-balances-service-get-stx-account-balance', account],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getStxBalancesService().getStxAccountBalance(account, signal),
    ...balanceQueryOptionsWithRefetch,
  });
}

export function useGetStxAddressBalanceQuery(address: string) {
  return useQuery({
    queryKey: ['stx-balances-service-get-stx-address-balance', address],
    queryFn: ({ signal }: QueryFunctionContext) =>
      getStxBalancesService().getStxAddressBalance(address, signal),
    enabled: !!address,
    ...balanceQueryOptions,
  });
}
