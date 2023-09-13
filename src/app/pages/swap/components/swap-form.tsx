import { Form, Formik } from 'formik';
import { Box } from 'leather-styles/jsx';

import { noop } from '@shared/utils';

import { HasChildren } from '@app/common/has-children';

import { useSwap } from '../hooks/use-swap';

export function SwapForm({ children }: HasChildren) {
  const { initialValues, validationSchema } = useSwap();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={noop}
      validateOnChange={false}
      validateOnMount={false}
      validationSchema={validationSchema}
    >
      <Box width="100%">
        <Form>{children}</Form>
      </Box>
    </Formik>
  );
}
