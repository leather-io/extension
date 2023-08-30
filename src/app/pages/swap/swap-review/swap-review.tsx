import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { ModalHeader } from '@app/components/modal-header';
import { PrimaryButton } from '@app/components/primary-button';

import { SwapAssetsPair } from '../components/swap-assets-pair/swap-assets-pair';
import { SwapContentLayout } from '../components/swap-content.layout';
import { SwapDetails } from '../components/swap-details/swap-details';
import { SwapFooterLayout } from '../components/swap-footer.layout';
import { useSwapContext } from '../swap.context';
import { SwapReviewLayout } from './swap-review.layout';

export function SwapReview() {
  const { onSubmitSwap } = useSwapContext();

  useRouteHeader(<ModalHeader defaultGoBack hideActions title="Review" />, true);

  return (
    <SwapReviewLayout>
      <SwapContentLayout>
        <SwapAssetsPair />
        <SwapDetails />
      </SwapContentLayout>
      <SwapFooterLayout>
        <PrimaryButton isLoading={false} onClick={onSubmitSwap} width="100%">
          Swap
        </PrimaryButton>
      </SwapFooterLayout>
    </SwapReviewLayout>
  );
}
