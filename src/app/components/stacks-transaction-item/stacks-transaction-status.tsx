import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { Text, color } from '@stacks/ui';
import { isPendingTx } from '@stacks/ui-utils';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { Tooltip } from '@app/components/tooltip';

import { PendingLabel } from '../transaction/pending-label';

interface TransactionStatusProps {
  transaction: StacksTx;
}
export function StacksTransactionStatus({ transaction }: TransactionStatusProps) {
  const isPending = isPendingTx(transaction as MempoolTransaction);
  const isFailed = !isPending && transaction.tx_status !== 'success';
  const showStatus = isPending || isFailed;
  return showStatus ? (
    <>
      {isPending && <PendingLabel />}
      {isFailed && (
        <Tooltip label={transaction.tx_status} placement="bottom">
          <Text color={color('feedback-error')} fontSize={0}>
            Failed
          </Text>
        </Tooltip>
      )}
    </>
  ) : null;
}
