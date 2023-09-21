import { ChangeEvent } from 'react';

import { useField, useFormikContext } from 'formik';
import { Stack, styled } from 'leather-styles/jsx';

import { isUndefined } from '@shared/utils';

import { useShowFieldError } from '@app/common/form-utils';

import { SwapFormValues } from '../hooks/use-swap';
import { useSwapContext } from '../swap.context';

interface SwapAmountFieldProps {
  amountAsFiat: string;
  isDisabled?: boolean;
  name: string;
}
export function SwapAmountField({ amountAsFiat, isDisabled, name }: SwapAmountFieldProps) {
  const { fetchToAmount, onSetIsSendingMax } = useSwapContext();
  const { setFieldValue, values } = useFormikContext<SwapFormValues>();
  const [field] = useField(name);
  const showError = useShowFieldError(name) && name === 'swapAmountFrom' && values.swapAssetTo;

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const { swapAssetFrom, swapAssetTo } = values;
    if (isUndefined(swapAssetFrom) || isUndefined(swapAssetTo)) return;
    onSetIsSendingMax(false);
    const value = event.currentTarget.value;
    const toAmount = await fetchToAmount(swapAssetFrom, swapAssetTo, value);
    await setFieldValue('swapAmountTo', Number(toAmount));
    field.onChange(event);
  }

  return (
    <Stack alignItems="flex-end" gap="space.01" width="50%">
      <styled.label hidden htmlFor={name}>
        {name}
      </styled.label>
      <styled.input
        _disabled={{
          bg: 'transparent',
          border: 'none',
          color: 'accent.text-subdued',
        }}
        autoComplete="off"
        border="none"
        color={showError ? 'error' : 'accent.text-primary'}
        display="block"
        disabled={isDisabled}
        p="0px"
        placeholder="0"
        ring="none"
        textAlign="right"
        textStyle="heading.05"
        type="number"
        width="100%"
        {...field}
        onChange={onChange}
      />
      {amountAsFiat ? (
        <styled.span color={showError ? 'error' : 'accent.text-subdued'} textStyle="caption.02">
          {amountAsFiat}
        </styled.span>
      ) : null}
    </Stack>
  );
}
