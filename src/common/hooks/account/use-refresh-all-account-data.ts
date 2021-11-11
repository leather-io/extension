import { useCallback } from 'react';
import { delay } from '@common/utils';
import { useRefreshAccountData } from '@store/accounts/account.hooks';
import { useCurrentAccountMempool } from '@query/mempool/mempool.hooks';

export function useRefreshAllAccountData() {
  const update = useRefreshAccountData();
  const { refetch } = useCurrentAccountMempool();
  return useCallback(
    async (ms?: number) => {
      if (typeof ms === 'number') await delay(ms);
      update(null);
      void refetch();
    },
    [update, refetch]
  );
}
