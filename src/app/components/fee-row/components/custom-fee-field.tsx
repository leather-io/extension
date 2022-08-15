import { Dispatch, FormEvent, SetStateAction, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import { useField } from 'formik';
import { color, Input, InputGroup, Stack, StackProps } from '@stacks/ui';

import { stxToMicroStx } from '@app/common/stacks-utils';
import { SendFormWarningMessages } from '@app/common/warning-messages';
import { Caption } from '@app/components/typography';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';
import { FeeEstimate } from '@shared/models/fees-types';

interface CustomFeeFieldProps extends StackProps {
  fieldName: string;
  lowFeeEstimate: FeeEstimate;
  setFieldWarning: Dispatch<SetStateAction<string | undefined>>;
}
export function CustomFeeField(props: CustomFeeFieldProps) {
  const { fieldName, lowFeeEstimate, setFieldWarning, ...rest } = props;
  const [input, meta, helpers] = useField(fieldName);

  const checkFieldWarning = useCallback(
    (value: string) => {
      if (meta.error) return setFieldWarning('');
      const fee = stxToMicroStx(value);
      if (new BigNumber(lowFeeEstimate.fee).isGreaterThan(fee)) {
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
