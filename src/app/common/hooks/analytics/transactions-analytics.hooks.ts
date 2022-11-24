import { useEffect, useMemo } from 'react';

import { AccountStxBalanceBigNumber } from '@shared/models/account.model';

import { useCurrentStacksAccountUnanchoredBalances } from '@app/query/stacks/balance/balance.hooks';
import { store } from '@app/store';
import { analyticsActions } from '@app/store/analytics/analytics.actions';
import { useAnalyticsHasStxDeposits } from '@app/store/analytics/analytics.selectors';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { useAnalytics } from './use-analytics';

function useIsFirstDeposit(stxBalance: AccountStxBalanceBigNumber | undefined): boolean {
  const currentNetwork = useCurrentNetworkState();
  const { chainId: stxChainId } = currentNetwork.chain.stacks;
  const hasStxDeposits = useAnalyticsHasStxDeposits()[stxChainId];
  const hasZeroStx = useMemo(
    () => stxBalance?.total_received.amount?.isEqualTo(0) || false,
    [stxBalance?.total_received]
  );
  useEffect(() => {
    if (!stxBalance) return;
    if (hasZeroStx || !hasStxDeposits) {
      store.dispatch(
        analyticsActions.hasStxDeposits({
          network: stxChainId,
          hasStxDeposits: !hasZeroStx,
        })
      );
    }
  }, [hasZeroStx, hasStxDeposits, stxChainId, stxBalance]);
  return !hasStxDeposits && !hasZeroStx;
}

export function useTrackFirstDeposit() {
  const analytics = useAnalytics();
  const { data: balances } = useCurrentStacksAccountUnanchoredBalances();
  const firstDeposit = useIsFirstDeposit(balances?.stx);
  useEffect(() => {
    if (!firstDeposit || !balances) return;
    void analytics.track('deposit_first_stx', { type: 'stx' });
  }, [analytics, balances, firstDeposit]);
}
