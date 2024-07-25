import { useCallback } from 'react';

import { useGetAddressMempoolTransactionsQuery } from '@leather.io/query';
import { delay } from '@leather.io/utils';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

// TODO: Can this be removed? It seems like we should be able
// to use react-query itself to do this if needed?
export function useRefreshAllAccountData() {
  const address = useCurrentStacksAccountAddress();
  const { refetch } = useGetAddressMempoolTransactionsQuery(address);
  return useCallback(
    async (ms?: number) => {
      if (typeof ms === 'number') await delay(ms);
      void refetch();
    },
    [refetch]
  );
}
