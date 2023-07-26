import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { SuggestedFirstStepStatus, SuggestedFirstSteps } from '@shared/models/onboarding-types';

import { useGetAnchoredAccountBalanceListQuery } from '@app/query/stacks/balance/stx-balance.query';
import { useAllAccountsNonFungibleTokenHoldingsTotal } from '@app/query/stacks/tokens/non-fungible-tokens/non-fungible-token-holdings.hooks';
import useGetNonFungibleTokenHoldingsQuery from '@app/query/stacks/tokens/non-fungible-tokens/non-fungible-token-holdings.query';
import {
  useCurrentStacksAccount,
  useStacksAccounts,
} from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';
import {
  useHideSuggestedFirstSteps,
  useSuggestedFirstStepsStatus,
} from '@app/store/onboarding/onboarding.selectors';

function useAllAccountsAvailableStxBalance(accounts?: StacksAccount[]) {
  const accountsBalances = useGetAnchoredAccountBalanceListQuery(accounts);
  return useMemo(() => {
    return accountsBalances.reduce(
      (acc, balance) => acc.plus(balance.data?.stx.balance || 0),
      new BigNumber(0)
    );
  }, [accountsBalances]);
}

export function useSuggestedFirstSteps() {
  const accounts = useStacksAccounts();
  const currentAccount = useCurrentStacksAccount();
  const hasHiddenSuggestedFirstSteps = useHideSuggestedFirstSteps();
  const stepsStatus = useSuggestedFirstStepsStatus();

  const { data: nonFungibleTokenHoldings } = useGetNonFungibleTokenHoldingsQuery(
    currentAccount?.address!
  );

  const firstFiveAccounts = accounts?.slice(0, 5) ?? [];
  const accountsAvailableStxBalance = useAllAccountsAvailableStxBalance(firstFiveAccounts);
  const accountsNonFungibleTokenHoldings =
    useAllAccountsNonFungibleTokenHoldingsTotal(firstFiveAccounts);

  const isAddFundsStepComplete = useMemo(
    () => accountsAvailableStxBalance?.isGreaterThan(0),
    [accountsAvailableStxBalance]
  );

  const isBuyNftStepComplete = useMemo(
    () => accountsNonFungibleTokenHoldings.isGreaterThan(0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nonFungibleTokenHoldings]
  );

  // This is the only step we need to persist
  const isExploreAppsStepComplete = useMemo(
    () => stepsStatus[SuggestedFirstSteps.ExploreApps] === SuggestedFirstStepStatus.Complete,
    [stepsStatus]
  );

  // The first step loads completed, so check the last three
  const hasCompletedSuggestedFirstSteps =
    isAddFundsStepComplete && isBuyNftStepComplete && isExploreAppsStepComplete;

  const showSuggestedFirstSteps =
    accounts &&
    accounts.length <= 5 &&
    !hasCompletedSuggestedFirstSteps &&
    !hasHiddenSuggestedFirstSteps;

  return {
    isAddFundsStepComplete,
    isBuyNftStepComplete,
    isExploreAppsStepComplete,
    showSuggestedFirstSteps,
  };
}
