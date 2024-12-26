import { ChangeEvent } from 'react';

import { SwapSelectors } from '@tests/selectors/swap.selectors';
import BigNumber from 'bignumber.js';
import { useField, useFormikContext } from 'formik';
import { Stack, styled } from 'leather-styles/jsx';

import {
  createMoneyFromDecimal,
  formatMoneyWithoutSymbol,
  isDefined,
  isUndefined,
} from '@leather.io/utils';

import type { SwapFormValues } from '@shared/models/form.model';

import { useShowFieldError } from '@app/common/form-utils';

import { type BaseSwapContext, useSwapContext } from '../../../swap.context';

function getPlaceholderValue(name: string, values: SwapFormValues) {
  if (name === 'swapAmountBase' && isDefined(values.swapAssetBase)) return '0';
  if (name === 'swapAmountQuote' && isDefined(values.swapAssetQuote)) return '0';
  return '-';
}

interface SwapAmountFieldProps {
  amountAsFiat?: string;
  isDisabled?: boolean;
  name: string;
}
export function SwapAmountField<T extends BaseSwapContext<T>>({
  amountAsFiat,
  isDisabled,
  name,
}: SwapAmountFieldProps) {
  const {
    isCrossChainSwap,
    isFetchingExchangeRate,
    onSetIsFetchingExchangeRate,
    onSetIsSendingMax,
    swapData,
  } = useSwapContext<T>();
  const { fetchQuoteAmount } = swapData;
  const { setFieldError, setFieldValue, values } = useFormikContext<SwapFormValues>();
  const [field] = useField(name);
  const showError = useShowFieldError(name) && name === 'swapAmountBase' && values.swapAssetQuote;

  async function onBlur(event: ChangeEvent<HTMLInputElement>) {
    const { swapAssetBase, swapAssetQuote } = values;
    if (isUndefined(swapAssetBase) || isUndefined(swapAssetQuote)) return;
    onSetIsSendingMax(false);
    const value = event.currentTarget.value;
    onSetIsFetchingExchangeRate(true);
    const toAmount = await fetchQuoteAmount(swapAssetBase, swapAssetQuote, value);
    onSetIsFetchingExchangeRate(false);
    const valueLengthAsDecimals = value.length - 1;
    if (isUndefined(toAmount) || valueLengthAsDecimals > swapAssetBase.balance.decimals) {
      await setFieldValue('swapAmountQuote', '');
      return;
    }
    const toAmountAsMoney = createMoneyFromDecimal(
      new BigNumber(toAmount),
      values.swapAssetQuote?.balance.symbol ?? '',
      values.swapAssetQuote?.balance.decimals
    );

    await setFieldValue(
      'swapAmountQuote',
      isCrossChainSwap ? toAmount : formatMoneyWithoutSymbol(toAmountAsMoney)
    );
    setFieldError('swapAmountQuote', undefined);
  }

  return (
    <Stack alignItems="flex-end" gap="space.01" width={['50%', '60%']}>
      <styled.input
        _disabled={{
          color: 'ink.text-subdued',
        }}
        autoComplete="off"
        bg="ink.background-primary"
        border="none"
        color={showError ? 'red.action-primary-default' : 'ink.text-primary'}
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
        <styled.span color={showError ? 'error' : 'ink.text-subdued'} textStyle="caption.01">
          {amountAsFiat}
        </styled.span>
      ) : null}
    </Stack>
  );
}
