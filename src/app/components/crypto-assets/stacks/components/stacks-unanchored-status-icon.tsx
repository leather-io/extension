import { color } from '@stacks/ui-utils';

import { MicroblockIcon } from '@app/components/icons/microblock';
import { TransactionTypeIconWrapper } from '@app/components/transaction/transaction-type-icon-wrapper';

export function StacksUnanchoredStatusIcon() {
  return (
    <TransactionTypeIconWrapper
      bg="invert"
      icon={() => (
        <MicroblockIcon
          fill={color('bg')}
          bg={color('accent')}
          borderColor={color('invert')}
          size="13px"
        />
      )}
    />
  );
}
