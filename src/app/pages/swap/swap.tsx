import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { useFormikContext } from 'formik';

import { Button } from '@leather.io/ui';
import { isUndefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { Card } from '@app/components/layout';
import { LoadingSpinner } from '@app/components/loading-spinner';

import { SwapAssetSelectBase } from './components/swap-asset-select/swap-asset-select-base';
import { SwapAssetSelectQuote } from './components/swap-asset-select/swap-asset-select-quote';
import { SwapFormValues } from './hooks/use-swap-form';
import { useSwapContext } from './swap.context';

export function Swap() {
  const {
    isFetchingExchangeRate,
    isPreparingSwapReview,
    swappableAssetsBase,
    swappableAssetsQuote,
  } = useSwapContext();
  const { dirty, isValid, setFieldValue, values, validateForm } =
    useFormikContext<SwapFormValues>();
  const { base, quote } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle if same asset selected; reset assets
    // Should not happen bc of list filtering
    if (base === quote) {
      void setFieldValue('swapAssetQuote', undefined);
      void setFieldValue('swapAmountQuote', '');
      return navigate(RouteUrls.Swap.replace(':base', 'STX').replace(':quote', ''));
    }
    if (base)
      void setFieldValue(
        'swapAssetBase',
        swappableAssetsBase.find(asset => asset.name === base)
      );
    if (quote)
      void setFieldValue(
        'swapAssetQuote',
        swappableAssetsQuote.find(asset => asset.name === quote)
      );
    void validateForm();
  }, [
    base,
    navigate,
    quote,
    setFieldValue,
    swappableAssetsBase,
    swappableAssetsQuote,
    validateForm,
    values.swapAssetBase,
  ]);

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
