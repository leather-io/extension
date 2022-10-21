import type { AddressNonces } from '@stacks/blockchain-api-client/lib/generated';
import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { useCurrentAccountStxAddressState } from '@app/store/accounts/account.hooks';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { useHiroApiRateLimiter } from '../rate-limiter';

const accountNoncesQueryOptions: UseQueryOptions = {
  refetchOnMount: 'always',
  refetchOnReconnect: 'always',
  refetchOnWindowFocus: 'always',
};

export function useGetAccountNonces() {
  const principal = useCurrentAccountStxAddressState();
  const network = useCurrentNetworkState();
  const { accountsApi } = useStacksClientUnanchored();
  const limiter = useHiroApiRateLimiter();

  const fetchAccountNonces = async () => {
    if (!principal) return;
    await limiter.removeTokens(1);
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
