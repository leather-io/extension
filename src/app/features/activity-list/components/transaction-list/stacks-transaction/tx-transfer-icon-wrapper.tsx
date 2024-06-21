import { type ReactNode } from 'react';

import { Circle } from 'leather-styles/jsx';

import { StxAvatarIcon } from '@leather.io/ui';

import { TransactionTypeIconWrapper } from '@app/components/transaction/transaction-type-icon-wrapper';

interface TxTransferIconWrapperProps {
  icon: ReactNode;
}
export function TxTransferIconWrapper({ icon }: TxTransferIconWrapperProps) {
  return (
    <Circle position="relative">
      <StxAvatarIcon />
      <TransactionTypeIconWrapper icon={icon} />
    </Circle>
  );
}
