import { useMemo } from 'react';
import { logger } from '@shared/logger';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/account.hooks';
import { useGetBnsNamesOwnedByAddress } from './bns.query';

export function useCurrentAccountNames() {
  const principal = useCurrentAccountStxAddressState();
  if (!principal) logger.error('No principal defined');
  const namesResponse = useGetBnsNamesOwnedByAddress(principal ?? '');
  return useMemo(() => namesResponse.data?.names ?? [], [namesResponse.data?.names]);
}

export function useGetAccountNamesByAddressQuery(address: string) {
  const namesResponse = useGetBnsNamesOwnedByAddress(address);
  return useMemo(() => namesResponse.data?.names ?? [], [namesResponse.data?.names]);
}
