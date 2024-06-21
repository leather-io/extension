import { TransactionTypes } from '@stacks/connect';

import { truncateMiddle } from '@leather.io/utils';

import { stacksValue } from '@app/common/stacks-utils';
import { EventCard } from '@app/components/event-card';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

export function StxPostCondition(): React.JSX.Element | null {
  const pendingTransaction = useTransactionRequestState();

  if (!pendingTransaction || pendingTransaction.txType !== TransactionTypes.STXTransfer)
    return null;

  return (
    <EventCard
      title="You'll send exactly"
      icon="STX"
      amount={stacksValue({ value: pendingTransaction.amount, withTicker: false })}
      ticker="STX"
      left="Stacks Token"
      right={
        pendingTransaction.txType === TransactionTypes.STXTransfer
          ? `To ${truncateMiddle(pendingTransaction.recipient, 4)}`
          : undefined
      }
    />
  );
}
