import { useQueries, useQuery } from '@tanstack/react-query';

import { AddressBalanceResponse } from '@shared/models/account.model';

import { AppUseQueryConfig } from '@app/query/query-config';
import { StacksClient } from '@app/query/stacks/stacks-client';
import { AccountWithAddress } from '@app/store/accounts/account.models';
import {
  useStacksClientAnchored,
  useStacksClientUnanchored,
} from '@app/store/common/api-clients.hooks';

import { RateLimiter, useHiroApiRateLimiter } from '../rate-limiter';

const staleTime = 1 * 60 * 1000;

const balanceQueryOptions = {
  staleTime,
  keepPreviousData: false,
  refetchOnMount: true,
} as const;

function fetchAccountBalance(client: StacksClient, limiter: RateLimiter) {
  return async (principal: string) => {
    await limiter.removeTokens(1);
    // Coercing type with client-side one that's more accurate
    return client.accountsApi.getAccountBalance({ principal }) as Promise<AddressBalanceResponse>;
  };
}

type FetchAccountBalanceResp = Awaited<ReturnType<ReturnType<typeof fetchAccountBalance>>>;

export function useUnanchoredStacksAccountBalanceQuery<T extends unknown = FetchAccountBalanceResp>(
  address: string,
  options?: AppUseQueryConfig<FetchAccountBalanceResp, T>
) {
  const limiter = useHiroApiRateLimiter();
  const client = useStacksClientUnanchored();
  return useQuery({
    queryKey: ['get-address-stx-balance', address],
    queryFn: () => fetchAccountBalance(client, limiter)(address),
    ...balanceQueryOptions,
    ...options,
  });
}

export function useAnchoredStacksAccountBalanceQuery<T extends unknown = FetchAccountBalanceResp>(
  address: string,
  options?: AppUseQueryConfig<FetchAccountBalanceResp, T>
) {
  const client = useStacksClientAnchored();
  const limiter = useHiroApiRateLimiter();

  return useQuery({
    enabled: !!address,
    queryKey: ['get-address-anchored-stx-balance', address],
    queryFn: () => fetchAccountBalance(client, limiter)(address),
    ...balanceQueryOptions,
    ...options,
  });
}

export function useGetAnchoredAccountBalanceListQuery(accounts?: AccountWithAddress[]) {
  const client = useStacksClientAnchored();
  const limiter = useHiroApiRateLimiter();

  return useQueries({
    queries: (accounts ?? []).map(account => ({
      queryKey: ['get-address-anchored-stx-balance', account.address],
      queryFn: () => fetchAccountBalance(client, limiter)(account.address),
      ...balanceQueryOptions,
    })),
  });
}
