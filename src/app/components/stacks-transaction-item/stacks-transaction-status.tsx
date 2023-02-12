import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { Text, color } from '@stacks/ui';
import { isPendingTx } from '@stacks/ui-utils';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { Tooltip } from '@app/components/tooltip';

import { PendingLabel } from '../transaction/pending-label';
import { InMicroblockLabel } from '../transaction/in-microblock-label';

interface TransactionStatusProps {
  transaction: StacksTx;
}
export function StacksTransactionStatus({ transaction }: TransactionStatusProps) {
  const isPending = isPendingTx(transaction as MempoolTransaction);
  const isFailed = !isPending && transaction.tx_status !== 'success';
  const inMicroblock = !isPending && transaction?.microblock_canonical  && transaction?.is_unanchored;

  const showStatus = isPending || isFailed || inMicroblock;
  return showStatus ? (
    <>
      {isPending && <PendingLabel />}
      {inMicroblock && <InMicroblockLabel />}
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
