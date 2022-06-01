import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useSuggestedFirstStepsStatus } from '@app/store/onboarding/onboarding.selectors';
import AddFundsFull from '@assets/images/onboarding/steps/add-funds-light.png';
import AddFundsFullDone from '@assets/images/onboarding/steps/add-funds-light-done.png';
import AddFundsPopup from '@assets/images/onboarding/steps/add-funds-light-sm.png';
import AddFundsPopupDone from '@assets/images/onboarding/steps/add-funds-light-done-sm.png';
import { SuggestedFirstSteps, SuggestedFirstStepStatus } from '@shared/models/onboarding-types';
import { RouteUrls } from '@shared/route-urls';

import { SuggestedFirstStep } from './suggested-first-step';

export function AddFundsStep() {
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const stepsStatus = useSuggestedFirstStepsStatus();

  const onSelectStep = useCallback(() => {
    void analytics.track('select_next_step', { step: 'add_funds' });
    navigate(RouteUrls.Fund);
  }, [analytics, navigate]);

  return (
    <SuggestedFirstStep
      action="Get STX"
      body="Get some STX so you can start using apps"
      imageFull={AddFundsFull}
      imageFullDone={AddFundsFullDone}
      imagePopup={AddFundsPopup}
      imagePopupDone={AddFundsPopupDone}
      isComplete={stepsStatus[SuggestedFirstSteps.AddFunds] === SuggestedFirstStepStatus.Complete}
      key={SuggestedFirstSteps.AddFunds}
      onClick={onSelectStep}
      title="Add funds"
    />
  );
}
