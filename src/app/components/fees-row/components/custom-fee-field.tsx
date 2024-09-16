import { FormEvent, useCallback } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { useField } from 'formik';
import { Flex, Stack, styled } from 'leather-styles/jsx';

import type { CryptoCurrency, StacksFeeEstimate } from '@leather.io/models';
import { stxToMicroStx } from '@leather.io/utils';

import { SendFormWarningMessages } from '@app/common/warning-messages';

interface CustomFeeFieldProps {
  feeCurrencySymbol: CryptoCurrency;
  lowFeeEstimate: StacksFeeEstimate;
  setFieldWarning(value: string): void;
  disableFeeSelection?: boolean;
}
export function CustomFeeField({
  feeCurrencySymbol,
  lowFeeEstimate,
  setFieldWarning,
  disableFeeSelection,
}: CustomFeeFieldProps) {
  const [field, meta, helpers] = useField('fee');

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
    <Stack position="relative">
      <Flex
        alignSelf="flex-end"
        color="ink.text-subdued"
        flexDirection="column"
        justifyContent="center"
        position="relative"
        width="130px"
        textStyle="label.02"
      >
        <styled.label htmlFor="fee" position="absolute" right={4} zIndex={999}>
          {feeCurrencySymbol}
        </styled.label>
        <styled.input
          autoComplete="off"
          borderRadius="xs"
          color="ink.text-subdued"
          data-testid={SharedComponentsSelectors.CustomFeeFieldInput}
          display="block"
          height="32px"
          name="fee"
          disabled={disableFeeSelection}
          onChange={(evt: FormEvent<HTMLInputElement>) => {
            void helpers.setValue(evt.currentTarget.value);
            // Separating warning check from field validations
            // bc we want the user to be able to submit the form
            // with the low fee warning present.
            checkFieldWarning(evt.currentTarget.value);
          }}
          pr="38px"
          placeholder="0"
          ring="none"
          textAlign="right"
          value={field.value}
        />
      </Flex>
    </Stack>
  );
}
