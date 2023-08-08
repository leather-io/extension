import { ChangeEvent } from 'react';

import { Input, Stack, color } from '@stacks/ui';
import { useField, useFormikContext } from 'formik';

import { useShowFieldError } from '@app/common/form-utils';
import { Caption } from '@app/components/typography';

import { SwapFormValues } from '../hooks/use-swap';
import { tempExchangeRate } from '../hooks/use-swappable-assets';

interface SwapAmountFieldProps {
  amountAsFiat: string;
  isDisabled?: boolean;
  name: string;
}
export function SwapAmountField({ amountAsFiat, isDisabled, name }: SwapAmountFieldProps) {
  const { setFieldValue } = useFormikContext<SwapFormValues>();
  const [field] = useField(name);
  const showError = useShowFieldError(name);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;

    // TODO: Need exchange rate here from asset
    await setFieldValue('swapAmountTo', Number(value) * tempExchangeRate);

    field.onChange(event);
  }

  return (
    <Stack alignItems="flex-end" spacing="extra-tight">
      <Input
        _disabled={{ border: 'none', color: color('text-caption') }}
        _focus={{ border: 'none' }}
        autoComplete="off"
        border="none"
        color={showError ? color('feedback-error') : 'unset'}
        display="block"
        fontSize="20px"
        height="28px"
        isDisabled={isDisabled}
        p="0px"
        placeholder="0"
        textAlign="right"
        type="number"
        width="100%"
        {...field}
        onChange={onChange}
      />
      <Caption color={showError ? color('feedback-error') : color('text-caption')}>
        {amountAsFiat}
      </Caption>
    </Stack>
  );
}
