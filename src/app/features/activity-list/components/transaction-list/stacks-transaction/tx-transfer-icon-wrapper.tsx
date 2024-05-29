import { type ReactNode } from 'react';

import { StxAvatarIcon } from '@leather-wallet/ui';
import { Circle } from 'leather-styles/jsx';

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
