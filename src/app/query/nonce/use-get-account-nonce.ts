import { useQuery, UseQueryOptions } from 'react-query';

import { useCurrentAccountStxAddressState } from '@app/store/accounts/account.hooks';
import { useCurrentNetworkState } from '@app/store/network/networks.hooks';
import { useApi } from '@app/store/common/api-clients.hooks';

export function useGetAccountNonce(reactQueryOptions: UseQueryOptions = {}) {
  const principal = useCurrentAccountStxAddressState();
  const network = useCurrentNetworkState();
  const { accountsApi } = useApi();

  const fetchNonce = () => {
    if (!principal) return;
    return accountsApi.getAccountNonces({ principal });
  };

  return useQuery(['accountNonce', principal, network], fetchNonce, {
    enabled: !!principal,
    ...(reactQueryOptions as any),
  });
}
