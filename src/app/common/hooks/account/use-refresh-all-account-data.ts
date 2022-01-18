import { useCallback } from 'react';
import { delay } from '@app/common/utils';
import { useRefreshAccountData } from '@app/store/accounts/account.hooks';
import { useCurrentAccountMempool } from '@app/query/mempool/mempool.hooks';

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
