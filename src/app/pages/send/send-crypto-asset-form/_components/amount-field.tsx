import { FormEvent, useCallback, useState } from 'react';

import { Flex, Input, Stack, Text, color } from '@stacks/ui';
import { useField } from 'formik';

import { ErrorLabel } from '@app/components/error-label';

const maxFontSize = 48;
const minFontSize = 22;

interface AmountFieldProps {
  decimals: number;
  symbol: string;
  rightInputOverlay: JSX.Element;
}
export function AmountField({ decimals, symbol, rightInputOverlay }: AmountFieldProps) {
  const [field, meta, helpers] = useField('amount');
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [previousTextLength, setPreviousTextLength] = useState(1);

  const maxLength = decimals === 0 ? 8 : decimals + 1; // + 1 for decimal char
  const addOrSubtractFromFontSize = (maxFontSize - minFontSize) / maxLength;

  // TODO: Needs formula if using ft decimals to determine max length
  const onChangeAmount = useCallback(
    (evt: FormEvent<HTMLInputElement>) => {
      const value = evt.currentTarget.value;
      if (value.length === symbol.length) setFontSize(maxFontSize);
      if (value.length > symbol.length && previousTextLength > value.length) {
        const textSize = Math.ceil(fontSize + addOrSubtractFromFontSize);
        fontSize < maxFontSize && setFontSize(textSize);
      } else if (value.length > symbol.length && previousTextLength < value.length) {
        const textSize = Math.ceil(fontSize - addOrSubtractFromFontSize);
        fontSize > 22 && setFontSize(textSize);
      }
      setPreviousTextLength(value.length);
      helpers.setValue(value);
    },
    [addOrSubtractFromFontSize, fontSize, helpers, previousTextLength, symbol.length]
  );

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
          name="amount"
          onChange={onChangeAmount}
          placeholder="0"
          px="none"
          textAlign="right"
          width={!field.value.length ? '1ch' : previousTextLength + 'ch'}
          value={field.value}
        />
        <Text fontSize={fontSize + 'px'} pl="tight">
          {symbol.toUpperCase()}
        </Text>
      </Flex>
      {meta.error && <ErrorLabel>{meta.error}</ErrorLabel>}
      {rightInputOverlay}
    </Stack>
  );
}
