import { useAsync } from 'react-async-hook';
import { Outlet } from 'react-router-dom';

import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { useFormikContext } from 'formik';

import { isUndefined } from '@shared/utils';

import { LoadingSpinner } from '@app/components/loading-spinner';
import { Button } from '@app/ui/components/button/button';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Card } from '@app/ui/layout/card/card';
import { CardContent } from '@app/ui/layout/card/card-content';

import { SwapSelectedAssets } from './components/swap-selected-assets';
import { SwapFormValues } from './hooks/use-swap-form';
import { useSwapContext } from './swap.context';

export function Swap() {
  const { isFetchingExchangeRate, swappableAssetsFrom } = useSwapContext();
  const { dirty, isValid, setFieldValue, values } = useFormikContext<SwapFormValues>();

  useAsync(async () => {
    if (isUndefined(values.swapAssetFrom))
      return await setFieldValue('swapAssetFrom', swappableAssetsFrom[0]);
    return;
  }, [swappableAssetsFrom, values.swapAssetFrom]);

  if (isUndefined(values.swapAssetFrom)) return <LoadingSpinner height="300px" />;

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
        <SwapSelectedAssets />
      </CardContent>
      <Outlet />
    </Card>
  );
}
