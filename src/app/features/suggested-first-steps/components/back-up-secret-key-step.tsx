import BackUpSecretKeyPopupDone from '@assets/images/onboarding/steps/backup-key-light-done-sm.png';
import BackUpSecretKeyFullDone from '@assets/images/onboarding/steps/backup-key-light-done.png';
import BackUpSecretKeyPopup from '@assets/images/onboarding/steps/backup-key-light-sm.png';
import BackUpSecretKeyFull from '@assets/images/onboarding/steps/backup-key-light.png';

import { SuggestedFirstSteps } from '@shared/models/onboarding-types';

import { SuggestedFirstStep } from './suggested-first-step';

interface BackUpSecretKeyStepProps {
  isComplete: boolean;
  onSelectStep(): void;
}
export function BackUpSecretKeyStep({ isComplete, onSelectStep }: BackUpSecretKeyStepProps) {
  return (
    <SuggestedFirstStep
      action="View secret key"
      body="Don't lose access to your account and crypto"
      imageFull={BackUpSecretKeyFull}
      imageFullDone={BackUpSecretKeyFullDone}
      imagePopup={BackUpSecretKeyPopup}
      imagePopupDone={BackUpSecretKeyPopupDone}
      isComplete={isComplete}
      key={SuggestedFirstSteps.BackUpSecretKey}
      onClick={onSelectStep}
      title="Back up secret key"
    />
  );
}
