import { type ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField } from 'formik';
import { Box, Flex, Stack, styled } from 'leather-styles/jsx';

import { STX_DECIMALS, TOKEN_NAME_LENGTH } from '@leather.io/constants';
import type { Money } from '@leather.io/models';

import { useShowFieldError } from '@app/common/form-utils';
import { linearInterpolation } from '@app/common/utils';
import { ErrorLabel } from '@app/components/error-label';

const amountInputId = 'amount-input';
const maxFontSize = 48;
const minFontSize = 22;
// This is set so the font resizing works. We can revisit the design,
// but this cannot be completely removed or the UI breaks.
const maxLength = STX_DECIMALS + 12;

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
  onSetIsSendingMax?(value: boolean): void;
}
export function AmountField({
  autoComplete = 'on',
  autofocus = false,
  balance,
  bottomInputOverlay,
  isSendingMax,
  onSetIsSendingMax,
  switchableAmount,
  tokenSymbol,
}: AmountFieldProps) {
  const [field, meta, helpers] = useField('amount');

  const showError = useShowFieldError('amount');
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [textSizeInPx, setTextSizeInPx] = useState(0);
  const [previousTextLength, setPreviousTextLength] = useState(1);
  const fieldRef = useRef<HTMLSpanElement>(null);

  const symbol = tokenSymbol || balance.symbol;

  const fontSizeModifier = (maxFontSize - minFontSize) / maxLength;
  const subtractedLengthToPositionPrefix = 0.5;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    /*
     * If the symbol is not a token (has more than 4 chars) we don't want to
     * modify the size since we will always use minFontSize to be avoid overflowing.
     * Since we are using lerp, as soon as we type 1 character we get a new font size
     * which makes content jump if we type 0 and placeholder is 0. That's why we only update the size
     * if we have none or more than 1 characters.
     */
    if (symbol.length <= TOKEN_NAME_LENGTH && value.length !== 1) {
      const t = value.length / (symbol.length + maxLength);

      const newFontSize = linearInterpolation({ start: maxFontSize, end: minFontSize, t });
      setFontSize(newFontSize);
    }

    field.onChange(event);
  };

  useEffect(() => {
    // case, when e.g token doesn't have symbol
    if (symbol.length > TOKEN_NAME_LENGTH) setFontSize(minFontSize);

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

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      const [text] = entries;
      const [size] = text?.contentBoxSize;
      if (size) {
        const { inlineSize } = size;
        setTextSizeInPx(inlineSize);
      }
    });

    const sizeReference = fieldRef.current;

    if (sizeReference) {
      resizeObserver.observe(sizeReference);
    }
    () => resizeObserver.disconnect();
  }, []);

  // TODO: could be implemented with html using padded label element
  const onClickFocusInput = useCallback(() => {
    if (isSendingMax) {
      void helpers.setValue('');
      onSetIsSendingMax?.(false);
    }

    // put focus in the queue, otherwise it won't work
    setTimeout(() => {
      document.getElementById(amountInputId)?.focus();
    });
  }, [isSendingMax, helpers, onSetIsSendingMax]);

  return (
    <Stack alignItems="center" gap={['space.04', showError ? 'space.04' : '48px']} width="100%">
      <Flex alignItems="center" flexDirection="column" onClick={onClickFocusInput} width="100%">
        {/* #4476 TODO check these fonts against design */}
        <Flex
          alignItems="center"
          height="55px"
          justifyContent="center"
          fontWeight={500}
          position="relative"
          fontFamily="Marche"
        >
          {isSendingMax ? <styled.span style={{ fontSize: fontSize + 'px' }}>~</styled.span> : null}
          <styled.input
            _disabled={{ bg: 'ink.background-primary' }}
            _focus={{
              border: 'none',
              color: 'ink.text-primary',
            }}
            bg="transparent"
            border="none"
            data-testid={SendCryptoAssetSelectors.AmountFieldInput}
            height="100%"
            id={amountInputId}
            disabled={isSendingMax}
            maxLength={maxLength}
            placeholder="0"
            px="none"
            ring="none"
            style={{
              fontSize: fontSize + 'px',
              marginInlineStart: !field.value?.length ? 0 : -25 + 'px',
              width: !field.value?.length ? '1ch' : textSizeInPx + 25 + 'px',
            }}
            textAlign="right"
            letterSpacing="0.64px"
            /*
             * We are adding an extra 25px to the variable since there's a transition for width
             * which makes the content cut momentarily while the width is updated. The 25px serve
             * as extra space so users don't experience that text cutting.
             * We are correcting for that extra space with a negative margin so the content is perfectly
             * centered
             */
            // width={!field.value?.length ? '1ch' : textSizeInPx + 25 + 'px'}
            // marginInlineStart={!field.value?.length ? 0 : -25 + 'px'}
            autoFocus={autofocus}
            fontWeight={500}
            autoComplete={autoComplete}
            {...field}
            onChange={onChange}
          />
          {/*
           * This is what we use to measure the size of the input, it's hidden
           * and with no pointer events so users can't interact with it
           */}
          <styled.span
            position="absolute"
            ref={fieldRef}
            visibility="hidden"
            pointerEvents="none"
            top={0}
            left={0}
            letterSpacing={-0.3 + 'px'}
            fontWeight={500}
            minWidth={1 + 'ch'}
            style={{ fontSize: fontSize + 'px' }}
          >
            {field.value}
          </styled.span>
          <styled.span
            fontFamily="Marche"
            color="ink.text-primary"
            letterSpacing="0.64px"
            pl="space.02"
            style={{ fontSize: fontSize + 'px' }}
          >
            {symbol.toUpperCase()}
          </styled.span>
        </Flex>
        <Box mt="12px">{switchableAmount && switchableAmount}</Box>
      </Flex>
      {showError && (
        <Flex>
          <ErrorLabel data-testid={SendCryptoAssetSelectors.AmountFieldInputErrorLabel}>
            {meta.error}
          </ErrorLabel>
        </Flex>
      )}
      {bottomInputOverlay}
    </Stack>
  );
}
