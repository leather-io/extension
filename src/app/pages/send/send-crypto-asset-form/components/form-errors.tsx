import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';

import { Box, Flex } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { FormikContextType, useFormikContext } from 'formik';

import { ErrorLabel } from '@app/components/error-label';

function omitAmountErrorsAsDisplayedElsewhere([key]: [string, unknown]) {
  return key !== 'amount';
}

function shouldDisplayErrors(form: FormikContextType<unknown>) {
  return (
    Object.entries(form.touched)
      .filter(omitAmountErrorsAsDisplayedElsewhere)
      .map(([_key, value]) => value)
      .includes(true) && Object.keys(form.errors).length
  );
}

const closedHeight = 24;
const openHeight = 56;

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

  const [firstError] =
    Object.entries(form.errors).filter(omitAmountErrorsAsDisplayedElsewhere) ?? [];

  const [message] = firstError ?? [];

  // TODO: This doesn't currently work with how we use two fields
  // to handle bns name fetching and validation. The field here
  // with the error is not the `firstError` so the input highlights
  // as having an error, but doesn't show the message. Replacing with
  // checking the entire form for `dirty`.
  // const isFirstErrorFieldTouched = (form.touched as any)[field];

  return message && form.dirty && shouldDisplayErrors(form) ? (
    <AnimateHeight duration={400} easing="ease-out" height={showHide}>
      <Flex height={openHeight + 'px'}>
        <ErrorLabel
          alignSelf="center"
          data-testid={SendCryptoAssetSelectors.FormFieldInputErrorLabel}
        >
          {firstError?.[1]}
        </ErrorLabel>
      </Flex>
    </AnimateHeight>
  ) : (
    <Box height={closedHeight + 'px'}></Box>
  );
}
