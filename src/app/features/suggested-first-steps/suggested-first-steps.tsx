import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useAppDispatch } from '@app/store';
import { onboardingActions } from '@app/store/onboarding/onboarding.actions';
import { useSuggestedFirstStepsStatus } from '@app/store/onboarding/onboarding.selectors';
import {
  SuggestedFirstSteps as Steps,
  SuggestedFirstStepStatus,
} from '@shared/models/onboarding-types';
import { RouteUrls } from '@shared/route-urls';

import { SuggestedFirstStepsLayout } from './suggested-first-steps.layout';
import { AddFundsStep } from './components/add-funds-step';
import { BackUpSecretKeyStep } from './components/back-up-secret-key-step';
import { ExploreAppsStep } from './components/explore-apps-step';
import { BuyNftStep } from './components/buy-nft-step';
import { useSuggestedFirstSteps } from './hooks/use-suggested-first-steps';

const eventName = 'select_next_step';
const exploreAppsExternalRoute = 'https://www.stacks.co/explore/discover-apps#apps';
const buyNftExternalRoute = 'https://www.hiro.so/wallet-faq/nfts';

export function SuggestedFirstSteps() {
  const analytics = useAnalytics();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const showSuggestedFirstSteps = useSuggestedFirstSteps();
  const stepsStatus = useSuggestedFirstStepsStatus();

  const onDismissSteps = useCallback(() => {
    void analytics.track('dismiss_suggested_first_steps');
    dispatch(onboardingActions.hideSuggestedFirstSteps(true));
  }, [analytics, dispatch]);

  const onSelectBackUpSecretKeyStep = useCallback(() => {
    void analytics.track(eventName, { step: 'back_up_secret_key' });
    navigate(RouteUrls.ViewSecretKey);
  }, [analytics, navigate]);

  const onSelectAddFundsStep = useCallback(() => {
    void analytics.track(eventName, { step: 'add_funds' });
    navigate(RouteUrls.Fund);
  }, [analytics, navigate]);

  const onSelectExploreAppsStep = useCallback(() => {
    void analytics.track(eventName, { step: 'explore_apps' });
    dispatch(onboardingActions.userCompletedSuggestedFirstStep({ step: Steps.ExploreApps }));
    openInNewTab(exploreAppsExternalRoute);
  }, [analytics, dispatch]);

  const onSelectBuyNftStep = useCallback(() => {
    void analytics.track(eventName, { step: 'buy_nft' });
    openInNewTab(buyNftExternalRoute);
  }, [analytics]);

  const hasCompletedBackUpSecretKeyStep =
    stepsStatus[Steps.BackUpSecretKey] === SuggestedFirstStepStatus.Complete;
  const hasCompletedAddFundsStep =
    stepsStatus[Steps.AddFunds] === SuggestedFirstStepStatus.Complete;
  const hasCompletedExploreAppsStep =
    stepsStatus[Steps.ExploreApps] === SuggestedFirstStepStatus.Complete;
  const hasCompletedBuyNftStep = stepsStatus[Steps.BuyNft] === SuggestedFirstStepStatus.Complete;

  if (!showSuggestedFirstSteps) return null;

  return (
    <SuggestedFirstStepsLayout onDismissSteps={onDismissSteps}>
      <BackUpSecretKeyStep
        isComplete={hasCompletedBackUpSecretKeyStep}
        onSelectStep={onSelectBackUpSecretKeyStep}
      />
      <AddFundsStep isComplete={hasCompletedAddFundsStep} onSelectStep={onSelectAddFundsStep} />
      <ExploreAppsStep
        isComplete={hasCompletedExploreAppsStep}
        onSelectStep={onSelectExploreAppsStep}
      />
      <BuyNftStep isComplete={hasCompletedBuyNftStep} onSelectStep={onSelectBuyNftStep} />
    </SuggestedFirstStepsLayout>
  );
}
