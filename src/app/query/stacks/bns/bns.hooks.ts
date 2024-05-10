import { logger } from '@shared/logger';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useGetBnsNamesOwnedByAddress } from './bns.query';

export function useCurrentAccountNames() {
  const principal = useCurrentStacksAccountAddress();
  return useGetBnsNamesOwnedByAddress(principal, {
    select: resp => {
      if (principal === '') logger.error('No principal defined');
      return resp.names ?? [];
    },
  });
}
