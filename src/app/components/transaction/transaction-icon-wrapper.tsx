import { ReactNode } from 'react';

import { Circle, CircleProps } from 'leather-styles/jsx';

import { StacksTx } from '@leather.io/models';

import { TransactionTypeIcon } from './transaction-type-icon';

interface TransactionIconWrapperProps extends CircleProps {
  icon: ReactNode;
  transaction: StacksTx;
}
export function TransactionIconWrapper({
  icon,
  transaction,
  ...props
}: TransactionIconWrapperProps) {
  return (
    <Circle
      bg="stacks"
      color="ink.background-primary"
      flexShrink={0}
      position="relative"
      size="xl"
      {...props}
    >
      {icon}
      <TransactionTypeIcon transaction={transaction} />
    </Circle>
  );
}
