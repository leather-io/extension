import { useQueries, useQuery } from '@tanstack/react-query';

import { AddressBalanceResponse } from '@shared/models/account.model';

import { AppUseQueryConfig } from '@app/query/query-config';
import { StacksClient } from '@app/query/stacks/stacks-client';
import type { AccountWithAddress } from '@app/store/accounts/account.models';
import { useStacksClient, useStacksClientAnchored } from '@app/store/common/api-clients.hooks';

const staleTime = 15 * 60 * 1000; // 15 min

const balanceQueryOptions = {
  keepPreviousData: false,
  staleTime,
  cacheTime: 0,
  refetchOnMount: true,
  refetchInterval: false,
  refetchOnReconnect: false,
} as const;

function fetchAccountBalance(client: StacksClient) {
  return async (principal: string) => {
    const resp = (await client.accountsApi.getAccountBalance({
      principal,
    })) as AddressBalanceResponse;
    return resp;
  };
}

type FetchAccountBalanceResp = Awaited<ReturnType<ReturnType<typeof fetchAccountBalance>>>;

export function useStacksAccountBalanceQuery<T extends unknown = FetchAccountBalanceResp>(
  address: string,
  options?: AppUseQueryConfig<FetchAccountBalanceResp, T>
) {
  const client = useStacksClient();
  return useQuery({
    enabled: !!address,
    queryKey: ['get-address-stx-balance', address],
    queryFn: () => fetchAccountBalance(client)(address),
    ...options,
  });
}

export function useAnchoredStacksAccountBalanceQuery<T extends unknown = FetchAccountBalanceResp>(
  address: string,
  options?: AppUseQueryConfig<FetchAccountBalanceResp, T>
) {
  const client = useStacksClientAnchored();
  return useQuery({
    enabled: !!address,
    queryKey: ['get-address-anchored-stx-balance', address],
    queryFn: () => fetchAccountBalance(client)(address),
    retryOnMount: true,
    ...balanceQueryOptions,
    ...options,
  });
}

export function useAnchoredAccountBalanceListQuery(accounts?: AccountWithAddress[]) {
  const client = useStacksClient();

  return useQueries({
    queries: (accounts ?? []).map(account => ({
      queryKey: ['get-address-anchored-stx-balance', account.address],
      queryFn: () => fetchAccountBalance(client)(account.address),
      ...balanceQueryOptions,
    })),
  });
}
