import { useEffect, useMemo } from 'react';

import {
  useAccounts,
  useCurrentAccountAvailableStxBalance,
} from '@app/store/accounts/account.hooks';
import { useAppDispatch } from '@app/store';
import { useHideSteps, useStepsStatus } from '@app/store/onboarding/onboarding.selectors';
import { onboardingActions } from '@app/store/onboarding/onboarding.actions';
import { useCurrentAccountUnanchoredBalances } from '@app/query/balance/balance.hooks';
import { OnboardingSteps, OnboardingStepStatus } from '@shared/models/onboarding-types';

export function useOnboardingSteps() {
  const dispatch = useAppDispatch();
  const hasHiddenSteps = useHideSteps();
  const onboardingStepsStatus = useStepsStatus();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const { data: balances } = useCurrentAccountUnanchoredBalances();
  const accounts = useAccounts();

  useEffect(() => {
    if (availableStxBalance?.isGreaterThan(0)) {
      dispatch(
        onboardingActions.updateStepsStatus({
          ...onboardingStepsStatus,
          [OnboardingSteps.AddFunds]: OnboardingStepStatus.Done,
        })
      );
    }

    if (balances && Object.keys(balances?.non_fungible_tokens).length > 0) {
      dispatch(
        onboardingActions.updateStepsStatus({
          ...onboardingStepsStatus,
          [OnboardingSteps.BuyNft]: OnboardingStepStatus.Done,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableStxBalance, balances?.non_fungible_tokens]);

  const hasCompletedOnboardingSteps = useMemo(() => {
    return Object.values(onboardingStepsStatus).every(val => val === OnboardingStepStatus.Done);
  }, [onboardingStepsStatus]);

  const showOnboardingSteps =
    accounts?.length === 1 && !hasCompletedOnboardingSteps && !hasHiddenSteps;

  return {
    showOnboardingSteps,
  };
}
