import { useQuery } from '@tanstack/react-query';

import { AddressBalanceResponse } from '@shared/models/account.model';

import { AppUseQueryConfig } from '@app/query/query-config';
import { StacksClient } from '@app/query/stacks/stacks-client';
import { useStacksClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

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

export function useStacksAccountBalanceQuery<T extends unknown = FetchAccountBalanceResp>(
  address: string,
  options?: AppUseQueryConfig<FetchAccountBalanceResp, T>
) {
  const client = useStacksClient();
  const limiter = useHiroApiRateLimiter();
  const network = useCurrentNetworkState();

  return useQuery({
    enabled: !!address,
    queryKey: ['get-address-stx-balance', address, network.id],
    queryFn: () => fetchAccountBalance(client, limiter)(address),
    ...balanceQueryOptions,
    ...options,
  });
}
