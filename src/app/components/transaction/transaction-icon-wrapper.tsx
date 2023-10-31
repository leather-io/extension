import { ReactNode } from 'react';

import { Circle, CircleProps } from 'leather-styles/jsx';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

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
      color="accent.background-primary"
      flexShrink={0}
      position="relative"
      size="36px"
      {...props}
    >
      {icon}
      <TransactionTypeIcon transaction={transaction} />
    </Circle>
  );
}
