import { ChangeEvent } from 'react';

import { SwapSelectors } from '@tests/selectors/swap.selectors';
import BigNumber from 'bignumber.js';
import { useField, useFormikContext } from 'formik';
import { Stack, styled } from 'leather-styles/jsx';

import { createMoney } from '@shared/models/money.model';
import { isDefined, isUndefined } from '@shared/utils';

import { useShowFieldError } from '@app/common/form-utils';
import { convertAmountToFractionalUnit } from '@app/common/money/calculate-money';
import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';

import { SwapFormValues } from '../hooks/use-swap-form';
import { useSwapContext } from '../swap.context';

function getPlaceholderValue(name: string, values: SwapFormValues) {
  if (name === 'swapAmountFrom' && isDefined(values.swapAssetFrom)) return '0';
  if (name === 'swapAmountTo' && isDefined(values.swapAssetTo)) return '0';
  return '-';
}

interface SwapAmountFieldProps {
  amountAsFiat: string;
  isDisabled?: boolean;
  name: string;
}
export function SwapAmountField({ amountAsFiat, isDisabled, name }: SwapAmountFieldProps) {
  const { fetchToAmount, isFetchingExchangeRate, onSetIsSendingMax } = useSwapContext();
  const { setFieldError, setFieldValue, values } = useFormikContext<SwapFormValues>();
  const [field] = useField(name);
  const showError = useShowFieldError(name) && name === 'swapAmountFrom' && values.swapAssetTo;

  async function onBlur(event: ChangeEvent<HTMLInputElement>) {
    const { swapAssetFrom, swapAssetTo } = values;
    if (isUndefined(swapAssetFrom) || isUndefined(swapAssetTo)) return;
    onSetIsSendingMax(false);
    const value = event.currentTarget.value;
    const toAmount = await fetchToAmount(swapAssetFrom, swapAssetTo, value);
    if (isUndefined(toAmount)) {
      await setFieldValue('swapAmountTo', '');
      return;
    }
    const toAmountAsMoney = createMoney(
      convertAmountToFractionalUnit(new BigNumber(toAmount), values.swapAssetTo?.balance.decimals),
      values.swapAssetTo?.balance.symbol ?? '',
      values.swapAssetTo?.balance.decimals
    );
    await setFieldValue('swapAmountTo', formatMoneyWithoutSymbol(toAmountAsMoney));
    setFieldError('swapAmountTo', undefined);
  }

  return (
    <Stack alignItems="flex-end" gap="space.01" width={['50%', '60%']}>
      <styled.input
        _disabled={{
          color: 'accent.text-subdued',
        }}
        autoComplete="off"
        bg="accent.background-primary"
        border="none"
        color={showError ? 'error.label' : 'accent.text-primary'}
        data-testid={SwapSelectors.SwapAmountInput}
        display="block"
        disabled={isDisabled || isFetchingExchangeRate}
        id={name}
        maxLength={15}
        p="0px"
        placeholder={getPlaceholderValue(name, values)}
        ring="none"
        textAlign="right"
        textStyle="heading.05"
        width="100%"
        {...field}
        onBlur={async e => {
          field.onBlur(e);
          await onBlur(e);
        }}
      />
      {amountAsFiat ? (
        <styled.span color={showError ? 'error' : 'accent.text-subdued'} textStyle="caption.02">
          {amountAsFiat}
        </styled.span>
      ) : null}
    </Stack>
  );
}
