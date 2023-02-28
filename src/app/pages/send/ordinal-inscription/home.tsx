import { Outlet } from 'react-router-dom';

import { Formik } from 'formik';

import { useOrdinalInscriptionFormValidationSchema } from './use-ordinal-inscription-form-validation-schema';

export const recipeintFieldName = 'recipient';

export function Home() {
  const validationSchema = useOrdinalInscriptionFormValidationSchema();

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ [recipeintFieldName]: '' }}
      onSubmit={values => console.log('TODO values', values)}
    >
      <Outlet />
    </Formik>
  );
}
