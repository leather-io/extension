import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { AddressNonces } from '@stacks/blockchain-api-client/lib/generated';

import { useCurrentAccountStxAddressState } from '@app/store/accounts/account.hooks';
import { useCurrentNetworkState } from '@app/store/network/networks.hooks';
import { useApi } from '@app/store/common/api-clients.hooks';

const accountNoncesQueryOptions: UseQueryOptions = {
  refetchOnMount: 'always',
  refetchOnReconnect: 'always',
  refetchOnWindowFocus: 'always',
};

export function useGetAccountNonces() {
  const principal = useCurrentAccountStxAddressState();
  const network = useCurrentNetworkState();
  const { accountsApi } = useApi();

  const fetchAccountNonces = () => {
    if (!principal) return;
    return accountsApi.getAccountNonces({
      principal,
    }) as Promise<AddressNonces>;
  };

  return useQuery({
    queryKey: ['account-nonces', principal, network],
    queryFn: fetchAccountNonces,
    enabled: !!principal,
    ...accountNoncesQueryOptions,
  }) as UseQueryResult<AddressNonces, Error>;
}
