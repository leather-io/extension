import { FormEvent, useCallback } from 'react';

import { Input, InputGroup, Stack, StackProps, color } from '@stacks/ui';
import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';
import { useField } from 'formik';

import { StacksFeeEstimate } from '@shared/models/fees/stacks-fees.model';

import { stxToMicroStx } from '@app/common/money/unit-conversion';
import { SendFormWarningMessages } from '@app/common/warning-messages';
import { Caption } from '@app/components/typography';

interface CustomFeeFieldProps extends StackProps {
  lowFeeEstimate: StacksFeeEstimate;
  setFieldWarning(value: string): void;
}
export function CustomFeeField(props: CustomFeeFieldProps) {
  const { lowFeeEstimate, setFieldWarning, ...rest } = props;
  const [input, meta, helpers] = useField('fee');

  const checkFieldWarning = useCallback(
    (value: string) => {
      if (meta.error) return setFieldWarning('');
      const fee = stxToMicroStx(value);
      if (lowFeeEstimate.fee.amount.isGreaterThan(fee)) {
        return setFieldWarning(SendFormWarningMessages.AdjustedFeeBelowLowestEstimate);
      }
      return setFieldWarning('');
    },
    [lowFeeEstimate, meta.error, setFieldWarning]
  );

  return (
    <Stack position="relative" {...rest}>
      <InputGroup
        alignSelf="flex-end"
        flexDirection="column"
        justifyContent="center"
        position="relative"
        width="130px"
      >
        <Caption as="label" htmlFor="fee" position="absolute" right={2} zIndex={999}>
          STX
        </Caption>
        <Input
          autoComplete="off"
          borderRadius="8px"
          color={color('text-caption')}
          data-testid={SendFormSelectors.InputCustomFeeField}
          display="block"
          height="32px"
          name="fee"
          onChange={(evt: FormEvent<HTMLInputElement>) => {
            helpers.setValue(evt.currentTarget.value);
            // Separating warning check from field validations
            // bc we want the user to be able to submit the form
            // with the low fee warning present.
            checkFieldWarning(evt.currentTarget.value);
          }}
          paddingRight="38px"
          placeholder="0.000000"
          textAlign="right"
          type="number"
          value={input.value}
        />
      </InputGroup>
    </Stack>
  );
}
