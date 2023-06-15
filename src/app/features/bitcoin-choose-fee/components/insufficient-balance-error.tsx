import { Box, BoxProps, Text, color } from '@stacks/ui';

export function InsufficientBalanceError(props: BoxProps) {
  return (
    <Box display="flex" alignItems="center" minHeight="40px" {...props}>
      <Text color={color('feedback-error')} fontSize={1} textAlign="center">
        Fee is too expensive for available bitcoin balance
      </Text>
    </Box>
  );
}
