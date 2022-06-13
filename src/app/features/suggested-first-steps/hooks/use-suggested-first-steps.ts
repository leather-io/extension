import { useEffect, useMemo } from 'react';

import {
  useAccountsNonFungibleTokenHoldings,
  useNonFungibleTokenHoldings,
} from '@app/query/non-fungible-tokens/non-fungible-token-holdings.hooks';
import {
  useAccounts,
  useAccountsAvailableStxBalance,
  useCurrentAccount,
  useCurrentAccountAvailableStxBalance,
} from '@app/store/accounts/account.hooks';
import { useAppDispatch } from '@app/store';
import {
  useHideSuggestedFirstSteps,
  useSuggestedFirstStepsStatus,
} from '@app/store/onboarding/onboarding.selectors';
import { onboardingActions } from '@app/store/onboarding/onboarding.actions';
import { SuggestedFirstSteps, SuggestedFirstStepStatus } from '@shared/models/onboarding-types';

export function useSuggestedFirstSteps() {
  const dispatch = useAppDispatch();
  const accounts = useAccounts();
  const currentAccount = useCurrentAccount();
  const hasHiddenSuggestedFirstSteps = useHideSuggestedFirstSteps();
  const stepsStatus = useSuggestedFirstStepsStatus();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const accountsAvailableStxBalance = useAccountsAvailableStxBalance();
  const nonFungibleTokenHoldings = useNonFungibleTokenHoldings(currentAccount?.address);
  const accountsNonFungibleTokenHoldings = useAccountsNonFungibleTokenHoldings(accounts);

  useEffect(() => {
    if (accountsAvailableStxBalance?.isGreaterThan(0)) {
      dispatch(
        onboardingActions.userCompletedSuggestedFirstStep({ step: SuggestedFirstSteps.AddFunds })
      );
    }

    if (accountsNonFungibleTokenHoldings.isGreaterThan(0)) {
      dispatch(
        onboardingActions.userCompletedSuggestedFirstStep({ step: SuggestedFirstSteps.BuyNft })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableStxBalance, nonFungibleTokenHoldings]);

  const hasCompletedSuggestedFirstSteps = useMemo(() => {
    return Object.values(stepsStatus).every(val => val === SuggestedFirstStepStatus.Complete);
  }, [stepsStatus]);

  return !hasCompletedSuggestedFirstSteps && !hasHiddenSuggestedFirstSteps;
}
