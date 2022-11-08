import { useCallback } from 'react';

import { delay } from '@app/common/utils';
import { useCurrentAccountMempool } from '@app/query/stacks/mempool/mempool.hooks';

// TODO: Can this be removed? It seems like we should be able
// to use react-query itself to do this if needed?
export function useRefreshAllAccountData() {
  const { refetch } = useCurrentAccountMempool();
  return useCallback(
    async (ms?: number) => {
      if (typeof ms === 'number') await delay(ms);
      void refetch();
    },
    [refetch]
  );
}
