import { useCallback } from 'react';

import { parseBalanceResponse } from '@app/query/stacks/balance/balance.hooks';
import { useStacksClientAnchored } from '@app/store/common/api-clients.hooks';

import { useAnalytics } from './use-analytics';

export function useTrackSwitchAccount() {
  const analytics = useAnalytics();
  const client = useStacksClientAnchored();

  return useCallback(
    async (address: string, index: number) => {
      const balancesResp = await client.accountsApi.getAccountBalance({ principal: address });
      const balances = parseBalanceResponse(balancesResp as any);
      const hasStxBalance = !!balances?.stx.availableStx.amount.isGreaterThan(0);
      void analytics.track('switch_account', { index, hasStxBalance });
    },
    [analytics, client.accountsApi]
  );
}
