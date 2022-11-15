import { logger } from '@shared/logger';

import { useCurrentAccountStxAddressState } from '@app/store/accounts/account.hooks';

import { useGetBnsNamesOwnedByAddress } from './bns.query';

export function useCurrentAccountNames() {
  const principal = useCurrentAccountStxAddressState();
  return useGetBnsNamesOwnedByAddress(principal, {
    select: resp => {
      if (principal === '') logger.error('No principal defined');
      return resp.names ?? [];
    },
  });
}

export function useCurrentAccountNamesQuery() {
  const principal = useCurrentAccountStxAddressState();
  const namesQuery = useGetBnsNamesOwnedByAddress(principal);
  if (principal === '') logger.error('No principal defined');
  return namesQuery;
}

export function useGetAccountNamesByAddressQuery(address: string) {
  return useGetBnsNamesOwnedByAddress(address, { select: resp => resp.names ?? [] });
}
