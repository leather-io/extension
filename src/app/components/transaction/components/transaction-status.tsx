import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { color, Text } from '@stacks/ui';
import { isPendingTx } from '@stacks/ui-utils';

import { Tooltip } from '@app/components/tooltip';
import { Tx } from '@app/common/api/transactions';

import { PendingLabel } from './pending-label';

interface TransactionStatusProps {
  transaction: Tx;
}
export function TransactionStatus({ transaction }: TransactionStatusProps) {
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
