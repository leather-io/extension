import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useFormikContext } from 'formik';

import { logger } from '@shared/logger';
import { isUndefined } from '@shared/utils';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { LeatherButton } from '@app/components/button/button';
import { ModalHeader } from '@app/components/modal-header';

import { SwapContentLayout } from './components/swap-content.layout';
import { SwapFooterLayout } from './components/swap-footer.layout';
import { SwapSelectedAssets } from './components/swap-selected-assets';
import { SwapFormValues } from './hooks/use-swap-form';
import { useSwapContext } from './swap.context';

export function Swap() {
  const { onSubmitSwapForReview, swappableAssetsFrom } = useSwapContext();
  const { dirty, handleSubmit, isValid, setFieldValue, values } =
    useFormikContext<SwapFormValues>();

  useRouteHeader(<ModalHeader defaultGoBack hideActions title="Swap" />, true);

  useEffect(() => {
    const setDefaultAsset = async () =>
      await setFieldValue('swapAssetFrom', swappableAssetsFrom[0]);

    if (isUndefined(values.swapAssetFrom)) setDefaultAsset().catch(e => logger.error(e));
  }, [setFieldValue, swappableAssetsFrom, values.swapAssetFrom]);

  return (
    <>
      <SwapContentLayout>
        <SwapSelectedAssets />
      </SwapContentLayout>
      <SwapFooterLayout>
        <LeatherButton
          disabled={!(dirty && isValid)}
          onClick={async () => {
            handleSubmit();
            await onSubmitSwapForReview(values);
          }}
          width="100%"
        >
          Review and swap
        </LeatherButton>
      </SwapFooterLayout>
      <Outlet />
    </>
  );
}
