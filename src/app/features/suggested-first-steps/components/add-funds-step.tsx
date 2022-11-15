import AddFundsPopupDone from '@assets/images/onboarding/steps/add-funds-light-done-sm.png';
import AddFundsFullDone from '@assets/images/onboarding/steps/add-funds-light-done.png';
import AddFundsPopup from '@assets/images/onboarding/steps/add-funds-light-sm.png';
import AddFundsFull from '@assets/images/onboarding/steps/add-funds-light.png';

import { SuggestedFirstSteps } from '@shared/models/onboarding-types';

import { SuggestedFirstStep } from './suggested-first-step';

interface AddFundsStepProps {
  isComplete: boolean;
  onSelectStep(): void;
}
export function AddFundsStep({ isComplete, onSelectStep }: AddFundsStepProps) {
  return (
    <SuggestedFirstStep
      action="Get STX"
      body="Get some STX so you can start using apps"
      imageFull={AddFundsFull}
      imageFullDone={AddFundsFullDone}
      imagePopup={AddFundsPopup}
      imagePopupDone={AddFundsPopupDone}
      isComplete={isComplete}
      key={SuggestedFirstSteps.AddFunds}
      onClick={onSelectStep}
      title="Add funds"
    />
  );
}
