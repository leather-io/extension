import { useQuery, UseQueryOptions } from 'react-query';

import { useApi, Api, useAnchoredApi } from '@app/store/common/api-clients.hooks';
import { AddressBalanceResponse } from '@shared/models/account-types';

const staleTime = 15 * 60 * 1000; // 15 min

const balanceQueryOptions = {
  keepPreviousData: false,
  cacheTime: staleTime,
  refetchOnMount: true,
  refetchInterval: false,
  refetchOnReconnect: false,
} as const;

function fetchAccountBalance(api: Api) {
  return (principal: string) => () =>
    // Coercing type with client-side one that's more accurate
    api.accountsApi.getAccountBalance({ principal }) as Promise<AddressBalanceResponse>;
}

export function useGetAccountBalanceQuery<T>(
  address: string,
  options: Partial<UseQueryOptions<AddressBalanceResponse, unknown, T, string[]>> = {}
) {
  const api = useApi();
  return useQuery({
    queryKey: ['get-address-stx-balance', address],
    queryFn: fetchAccountBalance(api)(address),
    suspense: true,
    ...balanceQueryOptions,
    ...options,
  });
}

export function useGetAnchoredAccountBalanceQuery<T>(
  address: string,
  options: Partial<UseQueryOptions<AddressBalanceResponse, unknown, T, string[]>> = {}
) {
  const api = useAnchoredApi();
  return useQuery({
    queryKey: ['get-address-anchored-stx-balance', address],
    queryFn: fetchAccountBalance(api)(address),
    suspense: true,
    ...balanceQueryOptions,
    ...options,
  });
}
