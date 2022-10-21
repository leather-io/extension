import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { useCurrentAccountStxAddressState } from '@app/store/accounts/account.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { DEFAULT_LIST_LIMIT, QueryRefreshRates } from '@shared/constants';
import { useStacksClient } from '@app/store/common/api-clients.hooks';
import { AddressTransactionsWithTransfersListResponse } from '@stacks/stacks-blockchain-api-types';

enum AccountClientKeys {
  TransactionsWithTransfersClient = 'account/TransactionsWithTransfersClient',
}

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
    queryKey: [AccountClientKeys.TransactionsWithTransfersClient, principal, networkUrl],
    queryFn: fetch,
    enabled: !!principal || !!networkUrl,
    ...queryOptions,
  }) as UseQueryResult<AddressTransactionsWithTransfersListResponse, Error>;
}
