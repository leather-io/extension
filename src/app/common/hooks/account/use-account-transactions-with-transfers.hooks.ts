import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/account.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';
import { useAccountTransactionsWithTransfersState } from '@app/store/accounts/transactions-with-transfer.hooks';
import { DEFAULT_LIST_LIMIT, QueryRefreshRates } from '@shared/constants';
import { PaginatedResults } from '@shared/models/types';
import { useStacksClient } from '@app/store/common/api-clients.hooks';

const QUERY_OPTIONS = {
  refetchInterval: QueryRefreshRates.MEDIUM,
  refetchOnMount: 'always',
  refetchOnReconnect: 'always',
  refetchOnWindowFocus: 'always',
};

enum AccountClientKeys {
  TransactionsWithTransfersClient = 'account/TransactionsWithTransfersClient',
}

function useGetAccountTransactionsWithTransfers(reactQueryOptions: UseQueryOptions = {}) {
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
    ...reactQueryOptions,
  });
}

export function useAccountTransactionsWithTransfers() {
  const [accountTransactionsWithTransfers, setAccountTransactionsWithTransfers] =
    useAccountTransactionsWithTransfersState();
  const onSuccess = (data: PaginatedResults<AddressTransactionWithTransfers>) => {
    setAccountTransactionsWithTransfers(data.results);
  };
  useGetAccountTransactionsWithTransfers({ ...QUERY_OPTIONS, onSuccess } as UseQueryOptions);
  return accountTransactionsWithTransfers;
}
