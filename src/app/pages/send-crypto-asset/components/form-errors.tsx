import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';

import { Flex } from '@stacks/ui';
import { useFormikContext } from 'formik';

import { ErrorLabel } from '@app/components/error-label';

function omitAmountErrorsAsDisplayedElsewhere([key]: [string, unknown]) {
  return key !== 'amount';
}

const closedHeight = 24;
const openHeight = 56;

export function FormErrors() {
  const [showHide, setShowHide] = useState(closedHeight);
  const form = useFormikContext();

  useEffect(() => {
    if ((!form.touched && !form.errors) || Object.keys(form.errors).length === 0) {
      setShowHide(closedHeight);
      return;
    }
    setShowHide(openHeight);
  }, [form.errors, form.touched]);

  const [firstError] = Object.entries(form.errors).filter(omitAmountErrorsAsDisplayedElsewhere);

  return (
    <AnimateHeight duration={400} easing="ease-out" height={showHide}>
      <Flex height={openHeight + 'px'}>
        {firstError && <ErrorLabel alignSelf="center">{firstError?.[0]}</ErrorLabel>}
      </Flex>
    </AnimateHeight>
  );
}
