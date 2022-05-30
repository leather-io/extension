import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useSuggestedFirstStepsStatus } from '@app/store/onboarding/onboarding.selectors';
import BackUpSecretKeyFull from '@assets/images/onboarding/steps/backup-key-light.png';
import BackUpSecretKeyFullDone from '@assets/images/onboarding/steps/backup-key-light-done.png';
import BackUpSecretKeyPopup from '@assets/images/onboarding/steps/backup-key-light-sm.png';
import BackUpSecretKeyPopupDone from '@assets/images/onboarding/steps/backup-key-light-done-sm.png';
import { SuggestedFirstSteps, SuggestedFirstStepStatus } from '@shared/models/onboarding-types';
import { RouteUrls } from '@shared/route-urls';

import { SuggestedFirstStep } from './suggested-first-step';

export function BackUpSecretKeyStep() {
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const suggestedFirstStepsStatus = useSuggestedFirstStepsStatus();

  const onSelectStep = useCallback(() => {
    void analytics.track('select_next_step', { step: SuggestedFirstSteps.BackUpSecretKey });
    navigate(RouteUrls.ViewSecretKey);
  }, [analytics, navigate]);

  return (
    <SuggestedFirstStep
      action="View secret key"
      body="Don't lose access to your account and crypto"
      imageFull={BackUpSecretKeyFull}
      imageFullDone={BackUpSecretKeyFullDone}
      imagePopup={BackUpSecretKeyPopup}
      imagePopupDone={BackUpSecretKeyPopupDone}
      isDone={
        suggestedFirstStepsStatus[SuggestedFirstSteps.BackUpSecretKey] ===
        SuggestedFirstStepStatus.Done
      }
      key={SuggestedFirstSteps.BackUpSecretKey}
      onClick={onSelectStep}
      title="Back up secret key"
    />
  );
}
