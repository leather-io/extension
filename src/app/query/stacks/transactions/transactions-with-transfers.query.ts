import { AddressTransactionsWithTransfersListResponse } from '@stacks/stacks-blockchain-api-types';
import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { DEFAULT_LIST_LIMIT } from '@shared/constants';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useStacksClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { useHiroApiRateLimiter } from '../hiro-rate-limiter';

const queryOptions: UseQueryOptions = {
  staleTime: 60 * 1000,
  refetchInterval: 30_000,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: true,
};

export function useGetAccountTransactionsWithTransfersQuery() {
  const principal = useCurrentStacksAccountAddress();
  const { chain } = useCurrentNetworkState();
  const client = useStacksClient();
  const limiter = useHiroApiRateLimiter();

  async function fetchAccountTxsWithTransfers(signal?: AbortSignal) {
    if (!principal) return;
    return limiter.add(
      () =>
        client.accountsApi.getAccountTransactionsWithTransfers({
          principal,
          limit: DEFAULT_LIST_LIMIT,
        }),
      {
        signal,
        throwOnTimeout: true,
      }
    );
  }

  return useQuery({
    queryKey: ['account-txs-with-transfers', principal, chain.stacks.url],
    queryFn: ({ signal }) => fetchAccountTxsWithTransfers(signal),
    enabled: !!principal && !!chain.stacks.url,
    ...queryOptions,
  }) as UseQueryResult<AddressTransactionsWithTransfersListResponse, Error>;
}
