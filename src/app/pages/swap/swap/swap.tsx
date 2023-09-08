import { Outlet } from 'react-router-dom';

import { useFormikContext } from 'formik';
import { Box } from 'leather-styles/jsx';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { LeatherButton } from '@app/components/button/button';
import { ModalHeader } from '@app/components/modal-header';

import { SwapContentLayout } from '../components/swap-content.layout';
import { SwapFooterLayout } from '../components/swap-footer.layout';
import { SwapSelectedAssets } from '../components/swap-selected-assets';
import { SwapFormValues } from '../hooks/use-swap';
import { useSwapContext } from '../swap.context';

export function Swap() {
  const { onSubmitSwapForReview } = useSwapContext();
  const { dirty, handleSubmit, isValid, values } = useFormikContext<SwapFormValues>();

  useRouteHeader(<ModalHeader defaultGoBack hideActions title="Swap" />, true);

  return (
    <>
      <SwapContentLayout>
        <SwapSelectedAssets />
      </SwapContentLayout>
      <SwapFooterLayout>
        <LeatherButton
          disabled={!(dirty && isValid)}
          onClick={async (e: any) => {
            handleSubmit(e);
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
