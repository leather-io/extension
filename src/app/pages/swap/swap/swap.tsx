import { Outlet } from 'react-router-dom';

import { Box } from '@stacks/ui';
import { useFormikContext } from 'formik';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { ModalHeader } from '@app/components/modal-header';
import { PrimaryButton } from '@app/components/primary-button';

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
    <Box width="100%">
      <SwapContentLayout>
        <SwapSelectedAssets />
      </SwapContentLayout>
      <SwapFooterLayout>
        <PrimaryButton
          isDisabled={!(dirty && isValid)}
          onClick={async e => {
            handleSubmit(e);
            await onSubmitSwapForReview(values);
          }}
          width="100%"
        >
          Review and swap
        </PrimaryButton>
      </SwapFooterLayout>
      <Outlet />
    </Box>
  );
}
