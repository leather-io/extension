import React from 'react';

import { Circle } from 'leather-styles/jsx';

import { TransactionTypeIconWrapper } from '@app/components/transaction/transaction-type-icon-wrapper';
import { StxIcon } from '@app/ui/components/icons/stx-icon';

interface TxTransferIconWrapperProps {
  icon: React.JSX.Element;
}
export function TxTransferIconWrapper({ icon }: TxTransferIconWrapperProps) {
  return (
    <Circle
      bg="stacks"
      color="accent.background-primary"
      flexShrink={0}
      height="36px"
      position="relative"
      width="36px"
    >
      <StxIcon />
      <TransactionTypeIconWrapper icon={icon} />
    </Circle>
  );
}
