import { useQuery, UseQueryOptions } from 'react-query';
import { useCurrentAccountStxAddressState } from '@store/accounts/account.hooks';
import { useCurrentNetworkState } from '@store/network/networks.hooks';
import { useAccountsApi } from '@store/common/api-clients.hooks';

export function useGetAccountNonce(reactQueryOptions: UseQueryOptions = {}) {
  const principal = useCurrentAccountStxAddressState();
  const network = useCurrentNetworkState();
  const { accountsApi } = useAccountsApi();
  const fetchNonce = () => {
    if (!principal) return;
    return accountsApi.getAccountNonces({ principal });
  };

  return useQuery(['accountNonce', principal, network], fetchNonce, {
    enabled: !!principal,
    ...reactQueryOptions,
  });
}
