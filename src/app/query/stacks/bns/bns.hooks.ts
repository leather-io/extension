import { useMemo } from 'react';

import { logger } from '@shared/logger';

import { useCurrentAccountStxAddressState } from '@app/store/accounts/account.hooks';

import { useGetBnsNamesOwnedByAddress } from './bns.query';

export function useCurrentAccountNames() {
  const principal = useCurrentAccountStxAddressState();
  const namesResponse = useGetBnsNamesOwnedByAddress(principal);
  if (principal === '') logger.error('No principal defined');
  return useMemo(() => namesResponse.data?.names ?? [], [namesResponse.data?.names]);
}

export function useCurrentAccountNamesQuery() {
  const principal = useCurrentAccountStxAddressState();
  const namesQuery = useGetBnsNamesOwnedByAddress(principal);
  if (principal === '') logger.error('No principal defined');
  return namesQuery;
}

export function useGetAccountNamesByAddressQuery(address: string) {
  const namesResponse = useGetBnsNamesOwnedByAddress(address);
  return useMemo(() => namesResponse.data?.names ?? [], [namesResponse.data?.names]);
}
