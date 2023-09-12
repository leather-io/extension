import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { LeatherButton } from '@app/components/button/button';
import { ModalHeader } from '@app/components/modal-header';

import { SwapAssetsPair } from '../components/swap-assets-pair/swap-assets-pair';
import { SwapContentLayout } from '../components/swap-content.layout';
import { SwapDetails } from '../components/swap-details/swap-details';
import { SwapFooterLayout } from '../components/swap-footer.layout';
import { useSwapContext } from '../swap.context';
import { SwapReviewLayout } from './swap-review.layout';
import { useFormikContext } from 'formik';
import { SwapFormValues } from '../hooks/use-swap';

export function SwapReview() {
  const { values: swapFormValues } = useFormikContext<SwapFormValues>();
  const { onSubmitSwap } = useSwapContext();

  useRouteHeader(<ModalHeader defaultGoBack hideActions title="Review" />, true);

  function submitSwap() {
    void onSubmitSwap(swapFormValues);
  }

  return (
    <SwapReviewLayout>
      <SwapContentLayout>
        <SwapAssetsPair />
        <SwapDetails />
      </SwapContentLayout>
      <SwapFooterLayout>
        <LeatherButton onClick={submitSwap} width="100%">
          Swap
        </LeatherButton>
      </SwapFooterLayout>
    </SwapReviewLayout>
  );
}
