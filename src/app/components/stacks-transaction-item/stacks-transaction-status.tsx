import { StacksTx } from '@leather.io/models';
import { Caption } from '@leather.io/ui';

import { isPendingTx } from '@app/common/transactions/stacks/transaction.utils';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

const pendingWaitingMessage =
  'This transaction is waiting to be confirmed. Depending on network congestion, this may take anywhere from a few minutes, to a couple of hours.';

interface TransactionStatusProps {
  transaction: StacksTx;
}
export function StacksTransactionStatus({ transaction }: TransactionStatusProps) {
  const isPending = isPendingTx(transaction);
  const isFailed = !isPending && transaction.tx_status !== 'success';

  return (
    <>
      {isPending && (
        <BasicTooltip asChild label={pendingWaitingMessage} side="bottom">
          <Caption color="yellow.action-primary-default">Pending</Caption>
        </BasicTooltip>
      )}
      {isFailed && (
        <BasicTooltip label={transaction.tx_status} side="bottom">
          <Caption color="yellow.action-primary-default">Failed</Caption>
        </BasicTooltip>
      )}
    </>
  );
}
