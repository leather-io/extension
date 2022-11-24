import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';

import { Flex } from '@stacks/ui';
import { FormikContextType, useFormikContext } from 'formik';

import { ErrorLabel } from '@app/components/error-label';

function omitAmountErrorsAsDisplayedElsewhere([key]: [string, unknown]) {
  return key !== 'amount';
}

const closedHeight = 24;
const openHeight = 56;

function shouldDisplayErrors(form: FormikContextType<unknown>) {
  return Object.values(form.touched).includes(true) && Object.keys(form.errors).length;
}

export function FormErrors() {
  const [showHide, setShowHide] = useState(closedHeight);
  const form = useFormikContext();

  useEffect(() => {
    if (shouldDisplayErrors(form)) {
      setShowHide(openHeight);
      return;
    }
    setShowHide(closedHeight);
  }, [form]);

  const [firstError] = Object.entries(form.errors).filter(omitAmountErrorsAsDisplayedElsewhere);

  return (
    <AnimateHeight duration={400} easing="ease-out" height={showHide}>
      <Flex height={openHeight + 'px'}>
        {firstError && shouldDisplayErrors(form) && (
          <ErrorLabel alignSelf="center">{firstError?.[0]}</ErrorLabel>
        )}
      </Flex>
    </AnimateHeight>
  );
}
