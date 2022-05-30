import { useEffect, useMemo } from 'react';

import {
  useAccounts,
  useCurrentAccountAvailableStxBalance,
} from '@app/store/accounts/account.hooks';
import { useAppDispatch } from '@app/store';
import {
  useHideSuggestedFirstSteps,
  useSuggestedFirstStepsStatus,
} from '@app/store/onboarding/onboarding.selectors';
import { onboardingActions } from '@app/store/onboarding/onboarding.actions';
import { useCurrentAccountUnanchoredBalances } from '@app/query/balance/balance.hooks';
import { SuggestedFirstSteps, SuggestedFirstStepStatus } from '@shared/models/onboarding-types';

export function useSuggestedFirstSteps() {
  const dispatch = useAppDispatch();
  const hideSuggestedFirstSteps = useHideSuggestedFirstSteps();
  const suggestedFirstStepsStatus = useSuggestedFirstStepsStatus();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const { data: balances } = useCurrentAccountUnanchoredBalances();
  const accounts = useAccounts();

  useEffect(() => {
    if (availableStxBalance?.isGreaterThan(0)) {
      dispatch(
        onboardingActions.updateSuggestedFirstStepsStatus({
          ...suggestedFirstStepsStatus,
          [SuggestedFirstSteps.AddFunds]: SuggestedFirstStepStatus.Done,
        })
      );
    }

    if (balances && Object.keys(balances?.non_fungible_tokens).length > 0) {
      dispatch(
        onboardingActions.updateSuggestedFirstStepsStatus({
          ...suggestedFirstStepsStatus,
          [SuggestedFirstSteps.BuyNft]: SuggestedFirstStepStatus.Done,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableStxBalance, balances?.non_fungible_tokens]);

  const hasCompletedOnboardingSteps = useMemo(() => {
    return Object.values(suggestedFirstStepsStatus).every(
      val => val === SuggestedFirstStepStatus.Done
    );
  }, [suggestedFirstStepsStatus]);

  const showSuggestedFirstSteps =
    accounts?.length === 1 && !hasCompletedOnboardingSteps && !hideSuggestedFirstSteps;

  return {
    showSuggestedFirstSteps,
  };
}
