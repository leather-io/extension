import { Box, Circle, color } from '@stacks/ui';

import { StxIcon } from '@app/components/icons/stx-icon';

import { TransactionTypeIconWrapper } from './transaction-type-icon-wrapper';

interface TxTransferIconWrapperProps {
  icon: React.FC;
}
export function TxTransferIconWrapper({ icon }: TxTransferIconWrapperProps) {
  return (
    <Circle bg={color('accent')} color={color('bg')} flexShrink={0} position="relative" size="36px">
      <Box as={StxIcon} />
      <TransactionTypeIconWrapper icon={icon} bg={'brand'} />
    </Circle>
  );
}
