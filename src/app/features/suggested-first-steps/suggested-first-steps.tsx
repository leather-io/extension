import { useCallback } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useAppDispatch } from '@app/store';
import { onboardingActions } from '@app/store/onboarding/onboarding.actions';

import { useSuggestedFirstSteps } from './hooks/use-suggested-first-steps';

import { SuggestedFirstStepsLayout } from './suggested-first-steps.layout';
import { AddFundsStep } from './components/add-funds-step';
import { BackUpSecretKeyStep } from './components/back-up-secret-key-step';
import { ExploreAppsStep } from './components/explore-apps-step';
import { BuyNftStep } from './components/buy-nft-step';

export function SuggestedFirstSteps() {
  const analytics = useAnalytics();
  const dispatch = useAppDispatch();
  useSuggestedFirstSteps();

  const onDismissSteps = useCallback(() => {
    void analytics.track('dismiss_suggested_first_steps');
    dispatch(onboardingActions.hideSuggestedFirstSteps(true));
  }, [analytics, dispatch]);

  return (
    <SuggestedFirstStepsLayout onDismissSteps={onDismissSteps}>
      <BackUpSecretKeyStep />
      <AddFundsStep />
      <ExploreAppsStep />
      <BuyNftStep />
    </SuggestedFirstStepsLayout>
  );
}
