import { ChangeEvent } from 'react';

import { Input, Stack, color } from '@stacks/ui';
import { useField, useFormikContext } from 'formik';

import { useShowFieldError } from '@app/common/form-utils';
import { Caption } from '@app/components/typography';

import { SwapFormValues } from '../hooks/use-swap';
import { useSwapContext } from '../swap.context';

interface SwapAmountFieldProps {
  amountAsFiat: string;
  isDisabled?: boolean;
  name: string;
}
export function SwapAmountField({ amountAsFiat, isDisabled, name }: SwapAmountFieldProps) {
  const { fetchToAmount } = useSwapContext();
  const { setFieldValue, values } = useFormikContext<SwapFormValues>();
  const [field] = useField(name);
  const showError = useShowFieldError(name);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    field.onChange(event);
    const value = event.currentTarget.value;
    const { swapAssetFrom, swapAssetTo } = values;
    if (swapAssetFrom != null && swapAssetTo && !isNaN(Number(value))) {
      await setFieldValue('swapAmountTo', '');
      const toAmount = await fetchToAmount(swapAssetFrom, swapAssetTo, value);
      await setFieldValue('swapAmountTo', toAmount);
    }
  }

  return (
    <Stack alignItems="flex-end" spacing="extra-tight">
      <Caption as="label" hidden htmlFor={name}>
        {name}
      </Caption>
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
