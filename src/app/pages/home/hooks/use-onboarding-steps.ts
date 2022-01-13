import { useEffect, useMemo } from 'react';

import {
  useAccounts,
  useCurrentAccountAvailableStxBalance,
} from '@app/store/accounts/account.hooks';
import { useCurrentAccountNames } from '@app/query/bns/bns.hooks';
import { OnboardingSteps, OnboardingStepStatus } from '@shared/models/onboarding-types';
import { useAppDispatch } from '@app/store';
import { useHideSteps, useStepsStatus } from '@app/store/onboarding/onboarding.selectors';
import { onboardingActions } from '@app/store/onboarding/onboarding.actions';

export function useOnboardingSteps() {
  const dispatch = useAppDispatch();
  const hideOnboardingSteps = useHideSteps();
  const onboardingStepsStatus = useStepsStatus();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const names = useCurrentAccountNames();
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

    if (!!names.length) {
      dispatch(
        onboardingActions.updateStepsStatus({
          ...onboardingStepsStatus,
          [OnboardingSteps.RegisterName]: OnboardingStepStatus.Done,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableStxBalance, names]);

  const hasCompletedOnboardingSteps = useMemo(() => {
    return Object.values(onboardingStepsStatus).every(val => val === OnboardingStepStatus.Done);
  }, [onboardingStepsStatus]);

  const showOnboardingSteps =
    accounts?.length === 1 && !hasCompletedOnboardingSteps && !hideOnboardingSteps;

  return {
    showOnboardingSteps,
  };
}
