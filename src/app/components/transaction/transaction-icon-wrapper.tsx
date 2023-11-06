import { BoxProps, Circle } from 'leather-styles/jsx';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { color } from '@app/common/utils/stacks-ui/ui/colors';

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
      bg={color('accent')}
      color={color('bg')}
      flexShrink={0}
      position="relative"
      size="36px"
      {...rest}
    >
      {/* // 4383 FIXME need to test this is working then refactor */}
      <Icon />
      <TransactionTypeIcon transaction={transaction} />
    </Circle>
  );
}
