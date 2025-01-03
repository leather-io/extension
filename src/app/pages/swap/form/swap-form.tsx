import { Form, Formik } from 'formik';

import { HasChildren } from '@app/common/has-children';

import { SwapFormLayout } from './swap-form.layout';
import { useSwapForm } from './use-swap-form';

export function SwapForm({ children }: HasChildren) {
  const { initialValues, validationSchema } = useSwapForm();

  return (
    <SwapFormLayout>
      <Formik
        initialValues={initialValues}
        // Called explicitly in Swap
        onSubmit={() => {}}
        validateOnChange={false}
        validateOnMount
        validationSchema={validationSchema}
      >
        <Form>{children}</Form>
      </Formik>
    </SwapFormLayout>
  );
}
