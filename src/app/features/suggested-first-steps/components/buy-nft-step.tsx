import BuyNftFull from '@assets/images/onboarding/steps/buy-nft-light.png';
import BuyNftFullDone from '@assets/images/onboarding/steps/buy-nft-light-done.png';
import BuyNftPopup from '@assets/images/onboarding/steps/buy-nft-light-sm.png';
import BuyNftPopupDone from '@assets/images/onboarding/steps/buy-nft-light-done-sm.png';
import { SuggestedFirstSteps } from '@shared/models/onboarding-types';

import { SuggestedFirstStep } from './suggested-first-step';

interface BuyNftStepProps {
  isComplete: boolean;
  onSelectStep(): void;
}
export function BuyNftStep({ isComplete, onSelectStep }: BuyNftStepProps) {
  return (
    <SuggestedFirstStep
      action="Find NFT"
      body="Collect and trade NFTs secured by Bitcoin"
      imageFull={BuyNftFull}
      imageFullDone={BuyNftFullDone}
      imagePopup={BuyNftPopup}
      imagePopupDone={BuyNftPopupDone}
      isComplete={isComplete}
      isExternalRoute
      key={SuggestedFirstSteps.BuyNft}
      onClick={onSelectStep}
      title="Buy an NFT"
    />
  );
}
