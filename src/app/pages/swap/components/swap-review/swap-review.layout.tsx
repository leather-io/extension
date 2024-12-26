import { Outlet } from 'react-router-dom';

import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { useFormikContext } from 'formik';

import { Button } from '@leather.io/ui';

import type { SwapFormValues } from '@shared/models/form.model';

import type { HasChildren } from '@app/common/has-children';
import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { Card } from '@app/components/layout';

import { type BaseSwapContext, useSwapContext } from '../../swap.context';

export function SwapReviewLayout<T extends BaseSwapContext<T>>({ children }: HasChildren) {
  const { swapData } = useSwapContext<T>();
  const { onSubmitSwap } = swapData;
  const { values } = useFormikContext<SwapFormValues>();
  const { isLoading } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);

  return (
    <>
      <Card
        dataTestId={SwapSelectors.SwapPageReady}
        footer={
          <Button
            aria-busy={isLoading}
            disabled={isLoading}
            data-testid={SwapSelectors.SwapSubmitBtn}
            type="button"
            onClick={() => onSubmitSwap({ values, swapData })}
            fullWidth
          >
            Swap
          </Button>
        }
      >
        {children}
      </Card>
      <Outlet />
    </>
  );
}
