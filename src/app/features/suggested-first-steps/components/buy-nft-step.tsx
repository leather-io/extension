import { useCallback } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useSuggestedFirstStepsStatus } from '@app/store/onboarding/onboarding.selectors';
import BuyNftFull from '@assets/images/onboarding/steps/buy-nft-light.png';
import BuyNftFullDone from '@assets/images/onboarding/steps/buy-nft-light-done.png';
import BuyNftPopup from '@assets/images/onboarding/steps/buy-nft-light-sm.png';
import BuyNftPopupDone from '@assets/images/onboarding/steps/buy-nft-light-done-sm.png';
import { SuggestedFirstSteps, SuggestedFirstStepStatus } from '@shared/models/onboarding-types';

import { SuggestedFirstStep } from './suggested-first-step';

const buyNftExternalRoute = 'https://www.hiro.so/wallet-faq/nfts';

export function BuyNftStep() {
  const analytics = useAnalytics();
  const stepsStatus = useSuggestedFirstStepsStatus();

  const onSelectStep = useCallback(() => {
    void analytics.track('select_next_step', { step: 'buy_nft' });
    openInNewTab(buyNftExternalRoute);
  }, [analytics]);

  return (
    <SuggestedFirstStep
      action="Find NFT"
      body="Collect and trade NFTs secured by Bitcoin"
      imageFull={BuyNftFull}
      imageFullDone={BuyNftFullDone}
      imagePopup={BuyNftPopup}
      imagePopupDone={BuyNftPopupDone}
      isComplete={stepsStatus[SuggestedFirstSteps.BuyNft] === SuggestedFirstStepStatus.Complete}
      isExternalRoute
      key={SuggestedFirstSteps.BuyNft}
      onClick={onSelectStep}
      title="Buy an NFT"
    />
  );
}
