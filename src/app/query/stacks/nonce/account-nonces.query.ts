import { useQuery } from '@tanstack/react-query';
import PQueue from 'p-queue';

import { AppUseQueryConfig } from '@app/query/query-config';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useStacksClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { useHiroApiRateLimiter } from '../hiro-rate-limiter';
import { StacksClient } from '../stacks-client';

const accountNoncesQueryOptions = {
  refetchOnMount: 'always',
  refetchOnReconnect: 'always',
  refetchOnWindowFocus: 'always',
} as const;

function fetchAccountNonces(client: StacksClient, limiter: PQueue) {
  return async (principal: string) => {
    if (!principal) return;

    return limiter.add(
      () =>
        client.accountsApi.getAccountNonces({
          principal,
        }),
      {
        throwOnTimeout: true,
      }
    );
  };
}

type FetchAccountNoncesResp = Awaited<ReturnType<ReturnType<typeof fetchAccountNonces>>>;

export function useGetAccountNoncesQuery<T extends unknown = FetchAccountNoncesResp>(
  options?: AppUseQueryConfig<FetchAccountNoncesResp, T>
) {
  const principal = useCurrentStacksAccountAddress();
  const network = useCurrentNetworkState();
  const client = useStacksClient();
  const limiter = useHiroApiRateLimiter();

  return useQuery({
    enabled: !!principal,
    queryKey: ['account-nonces', principal, network],
    queryFn: () => fetchAccountNonces(client, limiter)(principal),
    ...accountNoncesQueryOptions,
    ...options,
  });
}
