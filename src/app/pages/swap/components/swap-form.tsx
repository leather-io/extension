import { Form, Formik } from 'formik';
import { Box } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';
import { NonceSetter } from '@app/components/nonce-setter';

import { useSwapForm } from '../hooks/use-swap-form';

export function SwapForm({ children }: HasChildren) {
  const { initialValues, validationSchema } = useSwapForm();

  return (
    <Formik
      initialValues={initialValues}
      // Called explicitly in Swap
      onSubmit={() => {}}
      validateOnChange={false}
      validateOnMount
      validationSchema={validationSchema}
    >
      <Box width="100%">
        <NonceSetter />
        <Form>{children}</Form>
      </Box>
    </Formik>
  );
}
