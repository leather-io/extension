import { Form, Formik } from 'formik';

import type { SwapFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import type { HasChildren } from '@app/common/has-children';

import { useSwapNavigate } from '../hooks/use-swap-navigate';
import { type BaseSwapContext, useSwapContext } from '../swap.context';
import { constructSwapRoute } from '../swap.routes';
import { SwapFormLayout } from './swap-form.layout';
import { useSwapForm } from './use-swap-form';

export function SwapForm<T extends BaseSwapContext<T>>({ children }: HasChildren) {
  const { initialValues, validationSchema } = useSwapForm<T>();
  const { isSendingMax, onSetIsPreparingSwapReview, onSetSwapData, swapData } = useSwapContext<T>();
  const { chain, onSubmitSwapForReview } = swapData;
  const swapNavigate = useSwapNavigate();

  async function onReviewSwap(values: SwapFormValues) {
    onSetIsPreparingSwapReview(true);
    const data = await onSubmitSwapForReview({ values, swapData, isSendingMax });
    data && onSetSwapData(data);
    onSetIsPreparingSwapReview(false);
    swapNavigate(
      constructSwapRoute({
        chain,
        route: RouteUrls.SwapReview,
      })
    );
  }

  return (
    <SwapFormLayout>
      <Formik
        initialValues={initialValues}
        onSubmit={onReviewSwap}
        validateOnChange={false}
        validateOnMount
        validationSchema={validationSchema}
      >
        <Form>{children}</Form>
      </Formik>
    </SwapFormLayout>
  );
}
