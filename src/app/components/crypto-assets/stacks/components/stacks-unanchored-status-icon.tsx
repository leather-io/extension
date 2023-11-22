import { TransactionTypeIconWrapper } from '@app/components/transaction/transaction-type-icon-wrapper';
import { ZapIcon } from '@app/ui/components/icons/zap-icon';

export function StacksUnanchoredStatusIcon() {
  return <TransactionTypeIconWrapper bg="invert" icon={<ZapIcon bg="stacks" size="xs" />} />;
}
