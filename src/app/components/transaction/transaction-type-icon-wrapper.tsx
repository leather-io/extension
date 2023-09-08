import { BoxProps, Circle } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

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
      // #4164 FIXME migrate this bg needs a refactor
      bg={token(bg)}
      color={token('colors.accent.background-primary')}
      border="2px solid"
      borderColor={token('colors.accent.background-primary')}
      {...rest}
    >
      {/* // #4164 FIXME migrate this bg needs a refactor */}
      {/* <Box size="13px" as={Icon} /> */}
      <Icon />
    </Circle>
  );
}
