import { styled } from 'leather-styles/jsx';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { isPendingTx } from '@app/common/transactions/stacks/transaction.utils';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

import { MicroblockLabel } from '../transaction/microblock-label';
import { PendingLabel } from '../transaction/pending-label';

interface TransactionStatusProps {
  transaction: StacksTx;
}
export function StacksTransactionStatus({ transaction }: TransactionStatusProps) {
  const isPending = isPendingTx(transaction);
  const isFailed = !isPending && transaction.tx_status !== 'success';
  const isInMicroblock =
    !isPending && transaction.tx_status === 'success' && transaction.is_unanchored;

  return (
    <>
      {isPending && <PendingLabel />}
      {isInMicroblock && <MicroblockLabel />}
      {isFailed && (
        <BasicTooltip label={transaction.tx_status} side="bottom">
          <styled.span color="error.label" textStyle="label.03">
            Failed
          </styled.span>
        </BasicTooltip>
      )}
    </>
  );
}
