import { Outlet } from 'react-router-dom';

import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { useFormikContext } from 'formik';

import { Button } from '@leather.io/ui';
import { isUndefined } from '@leather.io/utils';

import type { SwapFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { Card } from '@app/components/layout';
import { LoadingSpinner } from '@app/components/loading-spinner';

import { SwapAssetSelectBase } from './components/swap-asset-select/swap-asset-select-base';
import { SwapAssetSelectQuote } from './components/swap-asset-select/swap-asset-select-quote';
import { useSwapNavigate } from './hooks/use-swap-navigate';
import { useSwapRouteParams } from './hooks/use-swap-route-params';
import { type BaseSwapContext, useSwapContext } from './swap.context';

export function Swap<T extends BaseSwapContext<T>>() {
  const {
    isFetchingExchangeRate,
    isPreparingSwapReview,
    isSendingMax,
    onSetIsPreparingSwapReview,
    onSetSwapData,
    swapData,
  } = useSwapContext<T>();
  const { onSubmitSwapForReview } = swapData;
  const { dirty, isValid, values, validateForm } = useFormikContext<SwapFormValues>();
  const navigate = useSwapNavigate();

  useSwapRouteParams();

  async function onReviewSwap() {
    await validateForm();
    onSetIsPreparingSwapReview(true);
    const data = await onSubmitSwapForReview({ values, swapData, isSendingMax });
    data && onSetSwapData(data);
    onSetIsPreparingSwapReview(false);
    navigate(RouteUrls.SwapReview);
  }

  if (isUndefined(values.swapAssetBase)) return <LoadingSpinner height="300px" />;

  return (
    <Card
      dataTestId={SwapSelectors.SwapPageReady}
      footer={
        <Button
          data-testid={SwapSelectors.SwapReviewBtn}
          aria-busy={isPreparingSwapReview}
          disabled={!(dirty && isValid) || isFetchingExchangeRate || isPreparingSwapReview}
          onClick={onReviewSwap}
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
