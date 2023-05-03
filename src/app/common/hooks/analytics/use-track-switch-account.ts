import { useCallback } from 'react';

import { queryClient } from '@app/common/persistence';
import { parseBalanceResponse } from '@app/query/stacks/balance/stx-balance.hooks';

import { useAnalytics } from './use-analytics';

export function useTrackSwitchAccount() {
  const analytics = useAnalytics();

  return useCallback(
    async (address: string, index: number) => {
      const accountBalanceCache = queryClient.getQueryData([
        'get-address-anchored-stx-balance',
        address,
      ]);
      if (!accountBalanceCache) return;
      try {
        const balances = parseBalanceResponse(accountBalanceCache as any);
        const hasStxBalance = !!balances?.stx.unlockedStx.amount.isGreaterThan(0);
        void analytics.track('switch_account', { index, hasStxBalance });
      } finally {
      }
    },
    [analytics]
  );
}
