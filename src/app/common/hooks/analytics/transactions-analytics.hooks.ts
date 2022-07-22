import { useEffect, useMemo } from 'react';

import { useCurrentAccountUnanchoredBalances } from '@app/query/balance/balance.hooks';
import { store } from '@app/store';
import { useAnalyticsHasStxDeposits } from '@app/store/analytics/analytics.selectors';
import { analyticsActions } from '@app/store/analytics/analytics.actions';
import { useCurrentNetworkState } from '@app/store/network/networks.hooks';
import { AccountStxBalanceBigNumber } from '@shared/models/account-types';

import { useAnalytics } from './use-analytics';

function useIsFirstDeposit(stxBalance: AccountStxBalanceBigNumber | undefined): boolean {
  const currentNetwork = useCurrentNetworkState();
  const hasStxDeposits = useAnalyticsHasStxDeposits()[currentNetwork.chainId];
  const hasZeroStx = useMemo(
    () => stxBalance?.total_received.isEqualTo(0) || false,
    [stxBalance?.total_received]
  );
  useEffect(() => {
    if (!stxBalance) return;
    if (hasZeroStx || !hasStxDeposits) {
      store.dispatch(
        analyticsActions.hasStxDeposits({
          network: currentNetwork.chainId,
          hasStxDeposits: !hasZeroStx,
        })
      );
    }
  }, [hasZeroStx, hasStxDeposits, currentNetwork.chainId, stxBalance]);
  return !hasStxDeposits && !hasZeroStx;
}

export function useTrackFirstDeposit() {
  const analytics = useAnalytics();
  const { data: balances } = useCurrentAccountUnanchoredBalances();
  const firstDeposit = useIsFirstDeposit(balances?.stx);
  useEffect(() => {
    if (!firstDeposit || !balances) return;
    void analytics.track('deposit_first_stx', { type: 'stx' });
  }, [analytics, balances, firstDeposit]);
}
