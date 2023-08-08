import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { InfoCardFooter } from '@app/components/info-card/info-card';
import { ModalHeader } from '@app/components/modal-header';
import { PrimaryButton } from '@app/components/primary-button';

import { SwapAssetsPair } from '../components/swap-assets-pair/swap-assets-pair';
import { SwapDetails } from '../components/swap-details/swap-details';
import { SwapLayout } from '../components/swap.layout';
import { SwapAsset } from '../hooks/use-swap';
import { SwapReviewLayout } from './swap-review.layout';

function useSwapReviewState() {
  const location = useLocation();

  return {
    swapAmountFrom: get(location.state, 'swapAmountFrom') as string,
    swapAmountTo: get(location.state, 'swapAmountTo') as string,
    swapAssetFrom: get(location.state, 'swapAssetFrom') as SwapAsset,
    swapAssetTo: get(location.state, 'swapAssetTo') as SwapAsset,
  };
}

export function SwapReview() {
  const navigate = useNavigate();
  const { swapAmountFrom, swapAmountTo, swapAssetFrom, swapAssetTo } = useSwapReviewState();

  useRouteHeader(<ModalHeader defaultGoBack hideActions title="Review" />, true);

  // TODO: Generate/broadcast transaction here and pass through to summary
  function onSubmitSwap() {
    navigate(RouteUrls.SwapSummary, {
      state: { swapAmountFrom, swapAmountTo, swapAssetFrom, swapAssetTo },
    });
  }

  return (
    <SwapReviewLayout>
      <SwapLayout>
        <SwapAssetsPair
          amountFrom={swapAmountFrom}
          amountTo={swapAmountTo}
          assetFrom={swapAssetFrom}
          assetTo={swapAssetTo}
        />
        <SwapDetails />
      </SwapLayout>
      <InfoCardFooter>
        <PrimaryButton isLoading={false} onClick={onSubmitSwap} width="100%">
          Swap
        </PrimaryButton>
      </InfoCardFooter>
    </SwapReviewLayout>
  );
}
