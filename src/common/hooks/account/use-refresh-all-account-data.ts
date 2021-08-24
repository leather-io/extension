import { useCallback } from 'react';
import { delay } from '@common/utils';
import { useRefreshAccountData } from '@store/accounts/account.hooks';

export function useRefreshAllAccountData() {
  const update = useRefreshAccountData();
  return useCallback(
    async (ms?: number) => {
      if (typeof ms === 'number') await delay(ms);
      update(null);
    },
    [update]
  );
}
