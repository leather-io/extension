import { TransactionTypes } from '@leather.io/stacks';
import { truncateMiddle } from '@leather.io/utils';

import { stacksValue } from '@app/common/stacks-utils';
import { EventCard } from '@app/components/event-card';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

/**
 * @deprecated Legacy transaction request
 */
export function StxPostCondition() {
  const pendingTransaction = useTransactionRequestState();

  if (!pendingTransaction || pendingTransaction.txType !== TransactionTypes.StxTokenTransfer)
    return null;

  return (
    <EventCard
      title="You'll send exactly"
      icon="STX"
      amount={stacksValue({
        value: pendingTransaction.amount,
        withTicker: false,
        fixedDecimals: true,
      })}
      ticker="STX"
      left="Stacks Token"
      right={
        pendingTransaction.txType === TransactionTypes.StxTokenTransfer
          ? `To ${truncateMiddle(pendingTransaction.recipient, 4)}`
          : undefined
      }
    />
  );
}
