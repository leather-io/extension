import { Outlet } from 'react-router-dom';

import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { useFormikContext } from 'formik';

import { Button } from '@leather.io/ui';
import { isUndefined } from '@leather.io/utils';

import type { SwapFormValues } from '@shared/models/form.model';

import { Card } from '@app/components/layout';
import { LoadingSpinner } from '@app/components/loading-spinner';

import { SwapAssetSelectBase } from './components/swap-asset-select/swap-asset-select-base';
import { SwapAssetSelectQuote } from './components/swap-asset-select/swap-asset-select-quote';
import { useSwapRouteParams } from './hooks/use-swap-route-params';
import { type BaseSwapContext, useSwapContext } from './swap.context';

export function Swap<T extends BaseSwapContext<T>>() {
  const { isFetchingExchangeRate, isPreparingSwapReview } = useSwapContext<T>();
  const { dirty, isValid, values } = useFormikContext<SwapFormValues>();

  useSwapRouteParams();

  if (isUndefined(values.swapAssetBase)) return <LoadingSpinner height="300px" />;

  return (
    <Card
      dataTestId={SwapSelectors.SwapPageReady}
      footer={
        <Button
          data-testid={SwapSelectors.SwapReviewBtn}
          aria-busy={isPreparingSwapReview}
          disabled={!(dirty && isValid) || isFetchingExchangeRate || isPreparingSwapReview}
          type="submit"
          fullWidth
        >
          Review and swap
        </Button>
      }
    >
      <SwapAssetSelectBase />
      <SwapAssetSelectQuote />
      <Outlet />
    </Card>
  );
}
