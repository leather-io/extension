import { StacksTx, StacksTxStatus } from '@leather.io/models';

import { statusFromTx } from '@app/common/transactions/stacks/transaction.utils';

import { TransactionIcon } from './transaction-icon';
import { TransactionTypeIconWrapper } from './transaction-type-icon-wrapper';

type StatusColorMap = Record<StacksTxStatus, string>;

function getColorFromTx(tx: StacksTx) {
  const colorMap: StatusColorMap = {
    pending: 'yellow.action-primary-default',
    success: 'stacks',
    failed: 'red.action-primary-default',
  };

  return colorMap[statusFromTx(tx)] ?? 'red.action-primary-default';
}

interface TransactionTypeIconProps {
  transaction: StacksTx;
}
export function TransactionTypeIcon({ transaction }: TransactionTypeIconProps) {
  if (
    ['coinbase', 'contract_call', 'smart_contract', 'token_transfer'].includes(transaction.tx_type)
  ) {
    return (
      <TransactionTypeIconWrapper
        bg={getColorFromTx(transaction)}
        icon={<TransactionIcon tx={transaction} />}
      />
    );
  }
  return null;
}
