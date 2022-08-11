import { useMemo } from 'react';

import {
  useAccountsNonFungibleTokenHoldings,
  useNonFungibleTokenHoldings,
} from '@app/query/non-fungible-tokens/non-fungible-token-holdings.hooks';
import { useAccounts, useCurrentAccount } from '@app/store/accounts/account.hooks';
import { useCurrentAccountAvailableStxBalance } from '@app/query/balance/balance.hooks';
import {
  useHideSuggestedFirstSteps,
  useSuggestedFirstStepsStatus,
} from '@app/store/onboarding/onboarding.selectors';
import { SuggestedFirstSteps, SuggestedFirstStepStatus } from '@shared/models/onboarding-types';
import { useAllAccountsAvailableStxBalance } from '@app/query/balance/balance.hooks';

export function useSuggestedFirstSteps() {
  const accounts = useAccounts();
  const currentAccount = useCurrentAccount();
  const hasHiddenSuggestedFirstSteps = useHideSuggestedFirstSteps();
  const stepsStatus = useSuggestedFirstStepsStatus();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const nonFungibleTokenHoldings = useNonFungibleTokenHoldings(currentAccount?.address);

  const firstFiveAccounts = accounts?.slice(0, 5);
  const accountsAvailableStxBalance = useAllAccountsAvailableStxBalance(firstFiveAccounts);
  const accountsNonFungibleTokenHoldings = useAccountsNonFungibleTokenHoldings(firstFiveAccounts);

  const isAddFundsStepComplete = useMemo(
    () => accountsAvailableStxBalance?.isGreaterThan(0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [availableStxBalance]
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
