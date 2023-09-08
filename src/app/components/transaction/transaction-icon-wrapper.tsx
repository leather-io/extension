import { BoxProps, Circle } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { TransactionTypeIcon } from './transaction-type-icon';

interface TransactionIconWrapperProps extends BoxProps {
  icon: React.FC;
  transaction: StacksTx;
}
export function TransactionIconWrapper({
  icon: Icon,
  transaction,
  ...rest
}: TransactionIconWrapperProps) {
  return (
    <Circle
      // #4164 FIXME migrate accent
      // bg={color('accent')}
      color={token('colors.accent.background-primary')}
      flexShrink={0}
      position="relative"
      size="36px"
      {...rest}
    >
      <Icon />
      <TransactionTypeIcon transaction={transaction} />
    </Circle>
  );
}
