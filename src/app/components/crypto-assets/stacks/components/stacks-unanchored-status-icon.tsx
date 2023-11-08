import { TransactionTypeIconWrapper } from '@app/components/transaction/transaction-type-icon-wrapper';
import { MicroblockIcon } from '@app/ui/components/icons/microblock-icon';

export function StacksUnanchoredStatusIcon() {
  return <TransactionTypeIconWrapper bg="invert" icon={<MicroblockIcon bg="stacks" />} />;
}
