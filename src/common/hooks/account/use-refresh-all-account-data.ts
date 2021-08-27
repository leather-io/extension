import { useCallback } from 'react';
import { delay } from '@common/utils';
import { useUpdateAtom } from 'jotai/utils';
import { refreshAccountDataState } from '@store/accounts';

export function useRefreshAllAccountData() {
  const update = useUpdateAtom(refreshAccountDataState);
  return useCallback(
    async (ms?: number) => {
      if (typeof ms === 'number') await delay(ms);
      update(null);
    },
    [update]
  );
}
