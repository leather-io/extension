import { Box, BoxProps, Circle, color } from '@stacks/ui';

interface TransactionTypeIconWrapperProps extends BoxProps {
  icon: React.FC;
  bg: any;
}
export function TransactionTypeIconWrapper({
  bg,
  icon: Icon,
  ...rest
}: TransactionTypeIconWrapperProps) {
  return (
    <Circle
      bottom="-2px"
      right="-9px"
      position="absolute"
      size="21px"
      bg={color(bg)}
      color={color('bg')}
      border="2px solid"
      borderColor={color('bg')}
      {...rest}
    >
      <Box size="13px" as={Icon} />
    </Circle>
  );
}
