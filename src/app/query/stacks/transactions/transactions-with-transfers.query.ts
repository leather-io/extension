import { AddressTransactionsWithTransfersListResponse } from '@stacks/stacks-blockchain-api-types';
import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { DEFAULT_LIST_LIMIT, QueryRefreshRates } from '@shared/constants';

import { useCurrentAccountStxAddressState } from '@app/store/accounts/account.hooks';
import { useStacksClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

const queryOptions = {
  refetchInterval: QueryRefreshRates.MEDIUM,
  refetchOnMount: 'always',
  refetchOnReconnect: 'always',
  refetchOnWindowFocus: 'always',
} as UseQueryOptions;

export function useGetAccountTransactionsWithTransfersQuery() {
  const principal = useCurrentAccountStxAddressState();
  const { url: networkUrl } = useCurrentNetworkState();
  const client = useStacksClient();
  const fetch = () => {
    if (!principal) return;
    return client.accountsApi.getAccountTransactionsWithTransfers({
      principal,
      limit: DEFAULT_LIST_LIMIT,
    });
  };

  return useQuery({
    queryKey: ['account-txs-with-transfers', principal, networkUrl],
    queryFn: fetch,
    enabled: !!principal && !!networkUrl,
    ...queryOptions,
  }) as UseQueryResult<AddressTransactionsWithTransfersListResponse, Error>;
}
