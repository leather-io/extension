import { FormEvent, useCallback } from 'react';

// #4164 FIXME migrate Input, InputGroup
import { Input, InputGroup } from '@stacks/ui';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { useField } from 'formik';
import { Stack, StackProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { StacksFeeEstimate } from '@shared/models/fees/stacks-fees.model';

import { stxToMicroStx } from '@app/common/money/unit-conversion';
import { SendFormWarningMessages } from '@app/common/warning-messages';
import { Caption } from '@app/components/typography';

interface CustomFeeFieldProps extends StackProps {
  feeCurrencySymbol: CryptoCurrencies;
  lowFeeEstimate: StacksFeeEstimate;
  setFieldWarning(value: string): void;
}
export function CustomFeeField(props: CustomFeeFieldProps) {
  const { feeCurrencySymbol, lowFeeEstimate, setFieldWarning, ...rest } = props;
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
    <Stack position="relative" {...rest}>
      <InputGroup
        alignSelf="flex-end"
        flexDirection="column"
        justifyContent="center"
        position="relative"
        width="130px"
      >
        <Caption as="label" htmlFor="fee" position="absolute" right={2} zIndex={999}>
          {feeCurrencySymbol}
        </Caption>
        <Input
          autoComplete="off"
          borderRadius="8px"
          color={token('colors.accent.text-subdued')}
          data-testid={SharedComponentsSelectors.CustomFeeFieldInput}
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
          pr="38px"
          placeholder="0"
          textAlign="right"
          type="number"
          value={field.value}
        />
      </InputGroup>
    </Stack>
  );
}
