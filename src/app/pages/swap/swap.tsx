import { Outlet, useNavigate } from 'react-router-dom';

import { Box } from '@stacks/ui';
import { Form, Formik } from 'formik';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { ModalHeader } from '@app/components/modal-header';

import { SwapFooter } from './components/swap-footer';
import { SwapSelectedAssets } from './components/swap-selected-assets';
import { SwapLayout } from './components/swap.layout';
import { SwapFormValues, useSwap } from './hooks/use-swap';

export function Swap() {
  const navigate = useNavigate();

  const { initialValues, validationSchema } = useSwap();

  useRouteHeader(<ModalHeader defaultGoBack hideActions title="Swap" />, true);

  function onSubmitSwapForReview(values: SwapFormValues) {
    navigate(RouteUrls.SwapReview, {
      state: { ...values },
    });
  }

  return (
    <Box width="100%">
      <Formik
        initialValues={initialValues}
        onSubmit={values => onSubmitSwapForReview(values)}
        validateOnChange={false}
        validateOnMount={false}
        validationSchema={validationSchema}
      >
        <Form>
          <SwapLayout>
            <SwapSelectedAssets />
          </SwapLayout>
          <SwapFooter />
          <Outlet />
        </Form>
      </Formik>
    </Box>
  );
}
