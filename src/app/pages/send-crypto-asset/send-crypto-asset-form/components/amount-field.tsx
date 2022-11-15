import { Box, Flex, Stack, Text, color } from '@stacks/ui';
import { useField } from 'formik';

import { amountInputId, maxInputContainerWidth, useFontResizer } from './use-font-resizer';

interface AmountFieldProps {
  rightInputOverlay: JSX.Element;
}
export function AmountField({ rightInputOverlay }: AmountFieldProps) {
  const [field] = useField('amount');
  const { inputFontSize } = useFontResizer();

  return (
    <Stack alignItems="center" spacing="48px">
      <Flex
        alignItems="center"
        height="55px"
        justifyContent="center"
        width={`${maxInputContainerWidth}px`}
      >
        <Flex flexBasis="50%">
          <Box
            as="input"
            id={amountInputId}
            caretColor={color('accent')}
            flexGrow={1}
            maxLength={10} // TODO: Replace with asset decimals + 3?
            outline="0px solid transparent"
            placeholder="0"
            pr="base-tight"
            textAlign="right"
            width="100%"
            wordWrap="normal"
            {...field}
          />
          {/* TODO: Replace with asset symbol */}
          <Text flexShrink={2} fontSize={inputFontSize} width="100%">
            BTC
          </Text>
        </Flex>
        {/* TODO: Add errors with validations */}
      </Flex>
      {rightInputOverlay}
    </Stack>
  );
}
