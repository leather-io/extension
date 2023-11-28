import { FormEvent, useCallback } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { useField } from 'formik';
import { Flex, Stack, styled } from 'leather-styles/jsx';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { StacksFeeEstimate } from '@shared/models/fees/stacks-fees.model';

import { stxToMicroStx } from '@app/common/money/unit-conversion';
import { SendFormWarningMessages } from '@app/common/warning-messages';

interface CustomFeeFieldProps {
  feeCurrencySymbol: CryptoCurrencies;
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
        color="accent.text-subdued"
        flexDirection="column"
        justifyContent="center"
        position="relative"
        width="130px"
      >
        <styled.label htmlFor="fee" position="absolute" right={2} zIndex={999}>
          <styled.span textStyle="label.02">{feeCurrencySymbol}</styled.span>
        </styled.label>
        <styled.input
          autoComplete="off"
          borderRadius="xs"
          color="accent.text-subdued"
          data-testid={SharedComponentsSelectors.CustomFeeFieldInput}
          display="block"
          height="32px"
          name="fee"
          disabled={disableFeeSelection}
          onChange={async (evt: FormEvent<HTMLInputElement>) => {
            await helpers.setValue(evt.currentTarget.value);
            // Separating warning check from field validations
            // bc we want the user to be able to submit the form
            // with the low fee warning present.
            checkFieldWarning(evt.currentTarget.value);
          }}
          pr="38px"
          placeholder="0"
          ring="none"
          textAlign="right"
          textStyle="label.02"
          value={field.value}
        />
      </Flex>
    </Stack>
  );
}
