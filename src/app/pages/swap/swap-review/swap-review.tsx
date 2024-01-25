import { Outlet } from 'react-router-dom';

import { SwapSelectors } from '@tests/selectors/swap.selectors';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { ModalHeader } from '@app/components/modal-header';
import { Button } from '@app/ui/components/button/button';

import { SwapAssetsPair } from '../components/swap-assets-pair/swap-assets-pair';
import { SwapContentLayout } from '../components/swap-content.layout';
import { SwapDetails } from '../components/swap-details/swap-details';
import { SwapFooterLayout } from '../components/swap-footer.layout';
import { useSwapContext } from '../swap.context';
import { SwapReviewLayout } from './swap-review.layout';

export function SwapReview() {
  const { onSubmitSwap } = useSwapContext();
  const { isLoading } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);

  useRouteHeader(<ModalHeader defaultGoBack hideActions title="Review" />, true);

  return (
    <>
      <SwapReviewLayout>
        <SwapContentLayout>
          <SwapAssetsPair />
          <SwapDetails />
        </SwapContentLayout>
        <SwapFooterLayout>
          <Button
            aria-busy={isLoading}
            data-testid={SwapSelectors.SwapBtn}
            type="button"
            onClick={onSubmitSwap}
            fullWidth
          >
            Swap
          </Button>
        </SwapFooterLayout>
      </SwapReviewLayout>
      <Outlet />
    </>
  );
}
