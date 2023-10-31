import { MicroblockIcon } from '@app/components/icons/microblock-icon';
import { TransactionTypeIconWrapper } from '@app/components/transaction/transaction-type-icon-wrapper';

export function StacksUnanchoredStatusIcon() {
  return (
    <TransactionTypeIconWrapper bg="invert" icon={<MicroblockIcon bg="stacks" size="13px" />} />
  );
}
