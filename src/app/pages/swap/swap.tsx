import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { useFormikContext } from 'formik';

import { Button } from '@leather.io/ui';
import { isUndefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { useUpdatePageHeaderContext } from '@app/common/page/page.context';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { Card } from '@app/ui/layout/card/card';
import { CardContent } from '@app/ui/layout/card/card-content';
import { Footer } from '@app/ui/layout/containers/footers/footer';

import { SwapAssetSelectBase } from './components/swap-asset-select/swap-asset-select-base';
import { SwapAssetSelectQuote } from './components/swap-asset-select/swap-asset-select-quote';
import { SwapFormValues } from './hooks/use-swap-form';
import { useSwapContext } from './swap.context';

export function Swap() {
  // Swap uses routed dialogs to choose assets so needs onBackLocation to go Home
  useUpdatePageHeaderContext({ title: 'Swap', onBackLocation: RouteUrls.Home });
  const { isFetchingExchangeRate, swappableAssetsBase, swappableAssetsQuote } = useSwapContext();
  const { dirty, isValid, setFieldValue, values, validateForm } =
    useFormikContext<SwapFormValues>();
  const { base, quote } = useParams();

  useEffect(() => {
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
      footer={
        <Footer variant="card">
          <Button
            data-testid={SwapSelectors.SwapReviewBtn}
            disabled={!(dirty && isValid) || isFetchingExchangeRate}
            type="submit"
            fullWidth
          >
            Review and swap
          </Button>
        </Footer>
      }
    >
      <CardContent dataTestId={SwapSelectors.SwapPageReady}>
        <SwapAssetSelectBase />
        <SwapAssetSelectQuote />
      </CardContent>
      <Outlet />
    </Card>
  );
}
