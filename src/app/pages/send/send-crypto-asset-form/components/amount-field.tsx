import { Box, Flex, Stack, Text, color } from '@stacks/ui';
import { useField } from 'formik';

import {
  amountInputId,
  assetSymbolId,
  maxInputContainerWidth,
  useFontResizer,
} from '../hooks/use-font-resizer';

interface AmountFieldProps {
  symbol: string;
  rightInputOverlay: JSX.Element;
}
export function AmountField({ symbol, rightInputOverlay }: AmountFieldProps) {
  const [field] = useField('amount');
  const { inputFontSize, symbolTextWidth } = useFontResizer();

  return (
    <Stack alignItems="center" spacing="48px">
      <Flex
        alignItems="center"
        height="55px"
        justifyContent="center"
        width={`${maxInputContainerWidth}px`}
      >
        <Flex flexGrow={1} justifyContent="flex-end">
          <Box textAlign="right" width={`${symbolTextWidth}px`}>
            <Box
              as="input"
              id={amountInputId}
              caretColor={color('accent')}
              fontSize="48px"
              maxLength={10} // TODO: Replace with asset decimals + 3?
              outline="0px solid transparent"
              placeholder="0"
              pr="base-tight"
              textAlign="right"
              width="100%"
              wordWrap="normal"
              {...field}
            />
          </Box>
        </Flex>
        <Flex flexGrow={1} flexShrink={2}>
          <Text display="block" fontSize={inputFontSize} id={assetSymbolId}>
            {symbol.toUpperCase()}
          </Text>
        </Flex>
        {/* TODO: Add errors with validations */}
      </Flex>
      {rightInputOverlay}
    </Stack>
  );
}
