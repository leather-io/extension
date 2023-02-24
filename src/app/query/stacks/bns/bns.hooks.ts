import { logger } from '@shared/logger';

import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

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

export function useGetAccountNamesByAddressQuery(address: string) {
  return useGetBnsNamesOwnedByAddress(address, { select: resp => resp.names ?? [] });
}
