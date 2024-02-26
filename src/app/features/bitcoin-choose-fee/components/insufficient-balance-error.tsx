import { Box, BoxProps, styled } from 'leather-styles/jsx';

export function InsufficientBalanceError(props: BoxProps) {
  return (
    <Box alignItems="center" display="flex" minHeight="40px" {...props}>
      <styled.span color="red.action-primary-default" textAlign="center" textStyle="label.03">
        Fee is too expensive for available bitcoin balance
      </styled.span>
    </Box>
  );
}
