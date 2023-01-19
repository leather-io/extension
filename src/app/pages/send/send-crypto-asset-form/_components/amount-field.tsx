import { useEffect, useState } from 'react';

import { Flex, Input, Stack, Text, color } from '@stacks/ui';
import { useField } from 'formik';

import { STX_DECIMALS } from '@shared/constants';
import { Money } from '@shared/models/money.model';

import { ErrorLabel } from '@app/components/error-label';

const maxFontSize = 48;
const minFontSize = 22;
const maxLengthDefault = STX_DECIMALS + 1; // + 1 for decimal char

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
  bottomInputOverlay: JSX.Element;
}
export function AmountField({ balance, bottomInputOverlay }: AmountFieldProps) {
  const [field, meta] = useField('amount');
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [previousTextLength, setPreviousTextLength] = useState(1);

  const { decimals, symbol } = balance;
  const maxLength = decimals === 0 ? maxLengthDefault : decimals + 1;
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

  return (
    <Stack alignItems="center" spacing={['base', meta.error ? 'base' : '48px']}>
      <Flex alignItems="center" height="55px" justifyContent="center">
        <Input
          _focus={{ border: 'none' }}
          border="none"
          caretColor={color('accent')}
          fontSize={fontSize + 'px'}
          height="100%"
          maxLength={9}
          placeholder="0"
          px="none"
          textAlign="right"
          width={!field.value.length ? '1ch' : previousTextLength + 'ch'}
          {...field}
        />
        <Text fontSize={fontSize + 'px'} pl="tight">
          {symbol.toUpperCase()}
        </Text>
      </Flex>
      {meta.error && <ErrorLabel>{meta.error}</ErrorLabel>}
      {bottomInputOverlay}
    </Stack>
  );
}
