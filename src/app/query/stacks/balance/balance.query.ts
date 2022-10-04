import { useQueries, useQuery, UseQueryOptions } from 'react-query';

import { useStacksClient, useStacksClientAnchored } from '@app/store/common/api-clients.hooks';
import { AddressBalanceResponse } from '@shared/models/account-types';
import { AccountWithAddress } from '@app/store/accounts/account.models';
import { StacksClient } from '@app/query/stacks/stacks-client';

const staleTime = 15 * 60 * 1000; // 15 min

const balanceQueryOptions = {
  keepPreviousData: false,
  cacheTime: staleTime,
  refetchOnMount: true,
  refetchInterval: false,
  refetchOnReconnect: false,
} as const;

function fetchAccountBalance(client: StacksClient) {
  return (principal: string) => () =>
    // Coercing type with client-side one that's more accurate
    client.accountsApi.getAccountBalance({ principal }) as Promise<AddressBalanceResponse>;
}

export function useGetAccountBalanceQuery<T>(
  address: string,
  options: Partial<UseQueryOptions<AddressBalanceResponse, unknown, T, string[]>> = {}
) {
  const client = useStacksClient();
  return useQuery({
    enabled: !!address,
    queryKey: ['get-address-stx-balance', address],
    queryFn: fetchAccountBalance(client)(address),
    suspense: true,
    ...balanceQueryOptions,
    ...options,
  });
}

export function useGetAnchoredAccountBalanceQuery<T>(
  address: string,
  options: Partial<UseQueryOptions<AddressBalanceResponse, unknown, T, string[]>> = {}
) {
  const client = useStacksClientAnchored();
  return useQuery({
    enabled: !!address,
    queryKey: ['get-address-anchored-stx-balance', address],
    queryFn: fetchAccountBalance(client)(address),
    suspense: true,
    ...balanceQueryOptions,
    ...options,
  });
}

export function useGetAnchoredAccountBalanceListQuery(accounts?: AccountWithAddress[]) {
  const client = useStacksClient();

  return useQueries(
    (accounts || []).map(account => ({
      queryKey: ['get-address-anchored-stx-balance', account.address],
      queryFn: fetchAccountBalance(client)(account.address),
      ...balanceQueryOptions,
    }))
  );
}
