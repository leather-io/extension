import { Circle } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { StxIcon } from '@app/components/icons/stx-icon';
import { TransactionTypeIconWrapper } from '@app/components/transaction/transaction-type-icon-wrapper';

interface TxTransferIconWrapperProps {
  icon: React.FC;
}
export function TxTransferIconWrapper({ icon }: TxTransferIconWrapperProps) {
  return (
    <Circle
      // #4164 FIXME migrate color('accent'
      // bg={color('accent')}
      bg={token('colors.accent.background-secondary')}
      color={token('colors.accent.background-primary')}
      flexShrink={0}
      position="relative"
      size="36px"
    >
      <StxIcon />
      <TransactionTypeIconWrapper icon={icon} bg={'brand'} />
    </Circle>
  );
}
