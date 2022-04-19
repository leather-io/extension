import ExploreAppsFull from '@assets/images/onboarding/steps/explore-apps-light.png';
import ExploreAppsFullDone from '@assets/images/onboarding/steps/explore-apps-light-done.png';
import ExploreAppsPopup from '@assets/images/onboarding/steps/explore-apps-light-sm.png';
import ExploreAppsPopupDone from '@assets/images/onboarding/steps/explore-apps-light-done-sm.png';
<<<<<<< HEAD
import { SuggestedFirstSteps } from '@shared/models/onboarding-types';

import { SuggestedFirstStep } from './suggested-first-step';
=======
import { SuggestedFirstSteps, SuggestedFirstStepStatus } from '@shared/models/onboarding-types';
import { onboardingActions } from '@app/store/onboarding/onboarding.actions';

import { SuggestedFirstStep } from './suggested-first-step';

const exploreAppsExternalRoute = 'https://www.stacks.co/explore/discover-apps#apps';

export function ExploreAppsStep() {
  const analytics = useAnalytics();
  const dispatch = useAppDispatch();
  const suggestedFirstStepsStatus = useSuggestedFirstStepsStatus();

  const onSelectStep = useCallback(() => {
    void analytics.track('select_next_step', { step: SuggestedFirstSteps.ExploreApps });
    dispatch(
      onboardingActions.updateSuggestedFirstStepsStatus({
        ...suggestedFirstStepsStatus,
        [SuggestedFirstSteps.ExploreApps]: SuggestedFirstStepStatus.Done,
      })
    );
    openInNewTab(exploreAppsExternalRoute);
  }, [analytics, dispatch, suggestedFirstStepsStatus]);
>>>>>>> 5cf51a947 (feat: request accounts)

interface ExploreAppsStepProps {
  isComplete: boolean;
  onSelectStep(): void;
}
export function ExploreAppsStep({ isComplete, onSelectStep }: ExploreAppsStepProps) {
  return (
    <SuggestedFirstStep
      action="Find apps"
      body="Try Stacks apps for finance, NFTs, blogging and more"
      imageFull={ExploreAppsFull}
      imageFullDone={ExploreAppsFullDone}
      imagePopup={ExploreAppsPopup}
      imagePopupDone={ExploreAppsPopupDone}
      isComplete={isComplete}
      isExternalRoute
      key={SuggestedFirstSteps.ExploreApps}
      onClick={onSelectStep}
      title="Explore apps"
    />
  );
}
