import { Form, Formik } from 'formik';

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
      <Form>{children}</Form>
    </Formik>
  );
}
