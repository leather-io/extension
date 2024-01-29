import { AddressTransactionsWithTransfersListResponse } from '@stacks/stacks-blockchain-api-types';
import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { DEFAULT_LIST_LIMIT } from '@shared/constants';

import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { useHiroApiRateLimiter } from '../rate-limiter';

const queryOptions: UseQueryOptions = {
  staleTime: 60 * 1000,
  refetchInterval: 30_000,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: true,
};

export function useGetAccountTransactionsWithTransfersQuery() {
  const principal = useCurrentAccountStxAddressState();
  const { chain } = useCurrentNetworkState();
  const client = useStacksClientUnanchored();
  const limiter = useHiroApiRateLimiter();

  async function fetchAccountTxsWithTransfers() {
    if (!principal) return;
    await limiter.removeTokens(1);
    return client.accountsApi.getAccountTransactionsWithTransfers({
      principal,
      limit: DEFAULT_LIST_LIMIT,
    });
  }

  return useQuery({
    queryKey: ['account-txs-with-transfers', principal, chain.stacks.url],
    queryFn: fetchAccountTxsWithTransfers,
    enabled: !!principal && !!chain.stacks.url,
    ...queryOptions,
  }) as UseQueryResult<AddressTransactionsWithTransfersListResponse, Error>;
}
