import { useCallback } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useAppDispatch } from '@app/store';
import { useSuggestedFirstStepsStatus } from '@app/store/onboarding/onboarding.selectors';
import ExploreAppsFull from '@assets/images/onboarding/steps/explore-apps-light.png';
import ExploreAppsFullDone from '@assets/images/onboarding/steps/explore-apps-light-done.png';
import ExploreAppsPopup from '@assets/images/onboarding/steps/explore-apps-light-sm.png';
import ExploreAppsPopupDone from '@assets/images/onboarding/steps/explore-apps-light-done-sm.png';
import { SuggestedFirstSteps, SuggestedFirstStepStatus } from '@shared/models/onboarding-types';
import { onboardingActions } from '@app/store/onboarding/onboarding.actions';

import { SuggestedFirstStep } from './suggested-first-step';

const exploreAppsExternalRoute = 'https://www.stacks.co/explore/discover-apps#apps';

export function ExploreAppsStep() {
  const analytics = useAnalytics();
  const dispatch = useAppDispatch();
  const stepsStatus = useSuggestedFirstStepsStatus();

  const onSelectStep = useCallback(() => {
    void analytics.track('select_next_step', { step: 'explore_apps' });
    dispatch(
      onboardingActions.userCompletedSuggestedFirstStep({ step: SuggestedFirstSteps.ExploreApps })
    );
    openInNewTab(exploreAppsExternalRoute);
  }, [analytics, dispatch]);

  return (
    <SuggestedFirstStep
      action="Find apps"
      body="Try Stacks apps for finance, NFTs, blogging and more"
      imageFull={ExploreAppsFull}
      imageFullDone={ExploreAppsFullDone}
      imagePopup={ExploreAppsPopup}
      imagePopupDone={ExploreAppsPopupDone}
      isComplete={
        stepsStatus[SuggestedFirstSteps.ExploreApps] === SuggestedFirstStepStatus.Complete
      }
      isExternalRoute
      key={SuggestedFirstSteps.ExploreApps}
      onClick={onSelectStep}
      title="Explore apps"
    />
  );
}
