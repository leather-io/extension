import { Box, Text, color } from '@stacks/ui';

export function InsufficientBalanceError() {
  return (
    <Box display="flex" alignItems="center" minHeight="40px">
      <Text color={color('feedback-error')} fontSize={1} textAlign="center">
        Fee is too expensive for available balance
      </Text>
    </Box>
  );
}
