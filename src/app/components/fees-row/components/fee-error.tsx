import { Text } from '@stacks/ui';
import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';
import { useField } from 'formik';

import { ErrorLabel } from '@app/components/error-label';

export function FeeError() {
  const [, meta] = useField('fee');

  return (
    <ErrorLabel data-testid={SendFormSelectors.InputCustomFeeFieldErrorLabel}>
      <Text
        data-testid={SendFormSelectors.InputCustomFeeFieldError}
        lineHeight="18px"
        textStyle="caption"
      >
        {meta.error}
      </Text>
    </ErrorLabel>
  );
}
