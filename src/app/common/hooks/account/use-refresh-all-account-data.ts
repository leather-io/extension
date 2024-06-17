import { useCallback } from 'react';

import { useAccountMempoolQuery } from '@leather-wallet/query';
import { delay } from '@leather-wallet/utils';

import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

// TODO: Can this be removed? It seems like we should be able
// to use react-query itself to do this if needed?
export function useRefreshAllAccountData() {
  const address = useCurrentStacksAccountAddress();
  const { refetch } = useAccountMempoolQuery(address);
  return useCallback(
    async (ms?: number) => {
      if (typeof ms === 'number') await delay(ms);
      void refetch();
    },
    [refetch]
  );
}
