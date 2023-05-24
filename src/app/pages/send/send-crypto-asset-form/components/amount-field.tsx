import { useCallback, useEffect, useState } from 'react';

import { Box, Flex, Input, Stack, Text, color } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField } from 'formik';

import { STX_DECIMALS } from '@shared/constants';
import { Money } from '@shared/models/money.model';

import { figmaTheme } from '@app/common/utils/figma-theme';
import { ErrorLabel } from '@app/components/error-label';

const amountInputId = 'amount-input';
const maxFontSize = 48;
const minFontSize = 22;
const maxLengthDefault = STX_DECIMALS + 2; // + 1 for decimal char

interface GetAmountModifiedFontSize {
  amount: string;
  fontSize: number;
  fontSizeModifier: number;
  maxFontSize: number;
  symbol: string;
}
function getAmountModifiedFontSize(props: GetAmountModifiedFontSize) {
  const { fontSize, fontSizeModifier, maxFontSize, amount, symbol } = props;
  const convertedAmountFontSize = amount.length * fontSizeModifier;
  return amount.length > symbol.length
    ? Math.ceil(fontSize - convertedAmountFontSize)
    : maxFontSize;
}

interface AmountFieldProps {
  autoComplete?: 'on' | 'off';
  autofocus?: boolean;
  balance: Money;
  bottomInputOverlay?: React.JSX.Element;
  isSendingMax?: boolean;
  switchableAmount?: React.JSX.Element;
  tokenSymbol?: string;
}
export function AmountField({
  autoComplete = 'on',
  autofocus = false,
  balance,
  bottomInputOverlay,
  isSendingMax,
  switchableAmount,
  tokenSymbol,
}: AmountFieldProps) {
  const [field, meta] = useField('amount');
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [previousTextLength, setPreviousTextLength] = useState(1);

  const { decimals } = balance;
  const symbol = tokenSymbol || balance.symbol;
  const maxLength = decimals === 0 ? maxLengthDefault : decimals + 2;
  const fontSizeModifier = (maxFontSize - minFontSize) / maxLength;
  const subtractedLengthToPositionPrefix = 0.5;

  useEffect(() => {
    // case, when e.g token doesn't have symbol
    if (symbol.length > 4) setFontSize(minFontSize);

    // Typing
    if (field.value.length === symbol.length) setFontSize(maxFontSize);
    if (field.value.length > symbol.length && previousTextLength > field.value.length) {
      const textSize = Math.ceil(fontSize + fontSizeModifier);
      fontSize < maxFontSize && setFontSize(textSize);
    } else if (field.value.length > symbol.length && previousTextLength < field.value.length) {
      const textSize = Math.ceil(fontSize - fontSizeModifier);
      fontSize > minFontSize && setFontSize(textSize);
    }
    // Copy/paste
    if (field.value.length > symbol.length && field.value.length > previousTextLength + 2) {
      const modifiedFontSize = getAmountModifiedFontSize({
        amount: field.value,
        fontSize,
        fontSizeModifier,
        maxFontSize,
        symbol,
      });
      setFontSize(modifiedFontSize < minFontSize ? minFontSize : modifiedFontSize);
    }
    setPreviousTextLength(
      isSendingMax ? field.value.length - subtractedLengthToPositionPrefix : field.value.length
    );
  }, [field.value, fontSize, fontSizeModifier, isSendingMax, previousTextLength, symbol]);

  // TODO: could be implemented with html using padded label element
  const onClickFocusInput = useCallback(() => {
    document.getElementById(amountInputId)?.focus();
  }, []);

  return (
    <Stack
      alignItems="center"
      onClick={onClickFocusInput}
      px="extra-loose"
      spacing={['base', meta.error && meta.touched ? 'base' : '48px']}
      width="100%"
    >
      <Flex alignItems="center" flexDirection="column">
        <Flex
          alignItems="center"
          height="55px"
          justifyContent="center"
          fontWeight={500}
          color={figmaTheme.text}
        >
          {isSendingMax ? <Text fontSize={fontSize + 'px'}>~</Text> : null}
          <Input
            _disabled={{ bg: color('bg') }}
            _focus={{ border: 'none' }}
            border="none"
            caretColor={color('accent')}
            data-testid={SendCryptoAssetSelectors.AmountFieldInput}
            fontSize={fontSize + 'px'}
            height="100%"
            id={amountInputId}
            isDisabled={isSendingMax}
            maxLength={maxLength}
            placeholder="0"
            px="none"
            textAlign="right"
            width={!field.value.length ? '1ch' : previousTextLength + 'ch'}
            autoFocus={autofocus}
            fontWeight={500}
            autoComplete={autoComplete}
            {...field}
          />
          <Text fontSize={fontSize + 'px'} pl="tight">
            {symbol.toUpperCase()}
          </Text>
        </Flex>
        <Box mt="12px">{switchableAmount && switchableAmount}</Box>
      </Flex>
      {meta.error && meta.touched && (
        <ErrorLabel data-testid={SendCryptoAssetSelectors.AmountFieldInputErrorLabel}>
          {meta.error}
        </ErrorLabel>
      )}
      {bottomInputOverlay}
    </Stack>
  );
}
