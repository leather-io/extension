import { Box, BoxProps, Circle, color } from '@stacks/ui';

import { Tx } from '@app/common/api/transactions';

import { TransactionTypeIcon } from './transaction-type-icon';

interface TransactionIconWrapperProps extends BoxProps {
  icon: React.FC;
  transaction: Tx;
}
export function TransactionIconWrapper({
  icon: Icon,
  transaction,
  ...rest
}: TransactionIconWrapperProps) {
  return (
    <Circle
      bg={color('accent')}
      color={color('bg')}
      flexShrink={0}
      position="relative"
      size="36px"
      {...rest}
    >
      <Box as={Icon} />
      <TransactionTypeIcon transaction={transaction} />
    </Circle>
  );
}
