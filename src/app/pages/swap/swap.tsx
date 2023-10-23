import { useAsync } from 'react-async-hook';
import { Outlet } from 'react-router-dom';

import { useFormikContext } from 'formik';

import { isUndefined } from '@shared/utils';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { LeatherButton } from '@app/components/button/button';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { ModalHeader } from '@app/components/modal-header';

import { SwapContentLayout } from './components/swap-content.layout';
import { SwapFooterLayout } from './components/swap-footer.layout';
import { SwapSelectedAssets } from './components/swap-selected-assets';
import { SwapFormValues } from './hooks/use-swap-form';
import { useSwapContext } from './swap.context';

export function Swap() {
  const { isFetchingExchangeRate, swappableAssetsFrom } = useSwapContext();
  const { dirty, isValid, setFieldValue, values } = useFormikContext<SwapFormValues>();

  useRouteHeader(<ModalHeader defaultGoBack hideActions title="Swap" />, true);

  useAsync(async () => {
    if (isUndefined(values.swapAssetFrom))
      return await setFieldValue('swapAssetFrom', swappableAssetsFrom[0]);
    return;
  }, [swappableAssetsFrom, values.swapAssetFrom]);

  if (isUndefined(values.swapAssetFrom)) return <LoadingSpinner height="300px" />;

  return (
    <>
      <SwapContentLayout>
        <SwapSelectedAssets />
      </SwapContentLayout>
      <SwapFooterLayout>
        <LeatherButton disabled={!(dirty && isValid) || isFetchingExchangeRate} width="100%">
          Review and swap
        </LeatherButton>
      </SwapFooterLayout>
      <Outlet />
    </>
  );
}
