import { useQuery } from '@tanstack/react-query';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { RateLimiter, useHiroApiRateLimiter } from '../rate-limiter';
import { StacksClient } from '../stacks-client';

const accountNoncesQueryOptions = {
  refetchOnMount: 'always',
  refetchOnReconnect: 'always',
  refetchOnWindowFocus: 'always',
} as const;

function fetchAccountNonces(client: StacksClient, limiter: RateLimiter) {
  return async (principal: string) => {
    if (!principal) return;
    await limiter.removeTokens(1);
    return client.accountsApi.getAccountNonces({
      principal,
    });
  };
}

type FetchAccountNoncesResp = Awaited<ReturnType<ReturnType<typeof fetchAccountNonces>>>;

export function useGetAccountNoncesQuery<T extends unknown = FetchAccountNoncesResp>(
  options?: AppUseQueryConfig<FetchAccountNoncesResp, T>
) {
  const principal = useCurrentAccountStxAddressState();
  const network = useCurrentNetworkState();
  const client = useStacksClientUnanchored();
  const limiter = useHiroApiRateLimiter();

  return useQuery({
    enabled: !!principal,
    queryKey: ['account-nonces', principal, network],
    queryFn: () => fetchAccountNonces(client, limiter)(principal),
    ...accountNoncesQueryOptions,
    ...options,
  });
}
