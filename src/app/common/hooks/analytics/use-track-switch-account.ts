import { useCallback } from 'react';

import { queryClient } from '@app/common/persistence';

import { useAnalytics } from './use-analytics';

export function useTrackSwitchAccount() {
  const analytics = useAnalytics();

  return useCallback(
    async (address: string, index: number) => {
      const accountBalanceCache = queryClient.getQueryData(['get-address-stx-balance', address]);
      if (!accountBalanceCache) return;
      try {
        const hasStxBalance = !!(accountBalanceCache as any).stx.unlockedStx.amount.isGreaterThan(
          0
        );
        void analytics.track('switch_account', { index, hasStxBalance });
      } finally {
      }
    },
    [analytics]
  );
}
