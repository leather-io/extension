import { Outlet } from 'react-router-dom';

import { SwapSelectors } from '@tests/selectors/swap.selectors';

import { Button } from '@leather.io/ui';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { Card, CardContent, Footer } from '@app/components/layout';

import { useSwapContext } from '../swap.context';
import { SwapAssetsPair } from './swap-assets-pair/swap-assets-pair';
import { SwapDetails } from './swap-details/swap-details';

export function SwapReview() {
  const { onSubmitSwap } = useSwapContext();
  const { isLoading } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);

  return (
    <>
      <Card
        footer={
          <Footer variant="card">
            <Button
              aria-busy={isLoading}
              data-testid={SwapSelectors.SwapSubmitBtn}
              type="button"
              onClick={onSubmitSwap}
              fullWidth
            >
              Swap
            </Button>
          </Footer>
        }
      >
        <CardContent dataTestId={SwapSelectors.SwapPageReady}>
          <SwapAssetsPair />
          <SwapDetails />
        </CardContent>
      </Card>
      <Outlet />
    </>
  );
}
