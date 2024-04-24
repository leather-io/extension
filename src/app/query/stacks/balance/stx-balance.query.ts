import { useQuery } from '@tanstack/react-query';

import * as accountService from '@app/api/stacks/services/account-service';
import { AppUseQueryConfig } from '@app/query/query-config';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useHiroApiRateLimiter } from '../hiro-rate-limiter';

const staleTime = 1 * 60 * 1000;

const balanceQueryOptions = {
  staleTime,
  keepPreviousData: false,
  refetchOnMount: true,
} as const;

type FetchAccountBalanceResp = Awaited<
  ReturnType<ReturnType<typeof accountService.fetchAccountBalances>>
>;

export function useStacksAccountBalancesQuery<T extends unknown = FetchAccountBalanceResp>(
  address: string,
  options?: AppUseQueryConfig<FetchAccountBalanceResp, T>
) {
  const limiter = useHiroApiRateLimiter();
  const network = useCurrentNetwork();

  return useQuery({
    enabled: !!address,
    queryKey: ['stacks-account-balances', address, network.id],
    queryFn: async ({ signal }) => {
      return limiter.add(() => accountService.fetchAccountBalances(network.id, signal)(address), {
        signal,
        throwOnTimeout: true,
      });
    },
    ...balanceQueryOptions,
    ...options,
  });
}
