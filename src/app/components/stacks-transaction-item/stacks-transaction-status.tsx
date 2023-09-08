import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { isPendingTx } from '@stacks/ui-utils';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { Tooltip } from '@app/components/tooltip';

import { MicroblockLabel } from '../transaction/microblock-label';
import { PendingLabel } from '../transaction/pending-label';

interface TransactionStatusProps {
  transaction: StacksTx;
}
export function StacksTransactionStatus({ transaction }: TransactionStatusProps) {
  const isPending = isPendingTx(transaction as MempoolTransaction);
  const isFailed = !isPending && transaction.tx_status !== 'success';
  const isInMicroblock =
    !isPending && transaction.tx_status === 'success' && transaction.is_unanchored;

  return (
    <>
      {isPending && <PendingLabel />}
      {isInMicroblock && <MicroblockLabel />}
      {isFailed && (
        <Tooltip label={transaction.tx_status} placement="bottom">
          <styled.span color={token('colors.error')} fontSize={0}>
            Failed
          </styled.span>
        </Tooltip>
      )}
    </>
  );
}
