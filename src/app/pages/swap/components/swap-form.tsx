import { Form, Formik } from 'formik';
import { Box } from 'leather-styles/jsx';

import { noop } from '@shared/utils';

import { HasChildren } from '@app/common/has-children';

import { useSwapForm } from '../hooks/use-swap-form';

export function SwapForm({ children }: HasChildren) {
  const { initialValues, validationSchema } = useSwapForm();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={noop}
      validateOnChange={false}
      validationSchema={validationSchema}
    >
      <Box width="100%">
        <Form>{children}</Form>
      </Box>
    </Formik>
  );
}
