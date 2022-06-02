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
  const hasHiddenSuggestedFirstSteps = useHideSuggestedFirstSteps();
  const stepsStatus = useSuggestedFirstStepsStatus();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const { data: balances } = useCurrentAccountUnanchoredBalances();
  const accounts = useAccounts();

  useEffect(() => {
    if (availableStxBalance?.isGreaterThan(0)) {
      dispatch(
        onboardingActions.userCompletedSuggestedFirstStep({ step: SuggestedFirstSteps.AddFunds })
      );
    }

    if (balances && Object.keys(balances?.non_fungible_tokens).length > 0) {
      dispatch(
        onboardingActions.userCompletedSuggestedFirstStep({ step: SuggestedFirstSteps.BuyNft })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableStxBalance, balances?.non_fungible_tokens]);

  const hasCompletedSuggestedFirstSteps = useMemo(() => {
    return Object.values(stepsStatus).every(val => val === SuggestedFirstStepStatus.Complete);
  }, [stepsStatus]);

  const showSuggestedFirstSteps =
    accounts?.length === 1 && !hasCompletedSuggestedFirstSteps && !hasHiddenSuggestedFirstSteps;

  return {
    showSuggestedFirstSteps,
  };
}
