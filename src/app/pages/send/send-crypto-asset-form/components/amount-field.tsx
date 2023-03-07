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
  balance: Money;
  switchableAmount?: JSX.Element;
  bottomInputOverlay?: JSX.Element;
  autofocus?: boolean;
  autoComplete?: 'on' | 'off';
}
export function AmountField({
  balance,
  switchableAmount,
  bottomInputOverlay,
  autofocus = false,
  autoComplete = 'on',
}: AmountFieldProps) {
  const [field, meta] = useField('amount');
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [previousTextLength, setPreviousTextLength] = useState(1);

  const { decimals, symbol } = balance;
  const maxLength = decimals === 0 ? maxLengthDefault : decimals + 2;
  const fontSizeModifier = (maxFontSize - minFontSize) / maxLength;

  useEffect(() => {
    // Typing
    if (field.value.length === symbol.length) setFontSize(maxFontSize);
    if (field.value.length > symbol.length && previousTextLength > field.value.length) {
      const textSize = Math.ceil(fontSize + fontSizeModifier);
      fontSize < maxFontSize && setFontSize(textSize);
    } else if (field.value.length > symbol.length && previousTextLength < field.value.length) {
      const textSize = Math.ceil(fontSize - fontSizeModifier);
      fontSize > 22 && setFontSize(textSize);
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
    setPreviousTextLength(field.value.length);
  }, [field.value, fontSize, fontSizeModifier, previousTextLength, symbol]);

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
          <Input
            _focus={{ border: 'none' }}
            border="none"
            caretColor={color('accent')}
            data-testid={SendCryptoAssetSelectors.AmountFieldInput}
            fontSize={fontSize + 'px'}
            height="100%"
            id={amountInputId}
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
