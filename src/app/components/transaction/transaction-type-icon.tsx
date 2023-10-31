import { StacksTx, StacksTxStatus } from '@shared/models/transactions/stacks-transaction.model';

import { statusFromTx } from '@app/common/transactions/stacks/transaction.utils';

import { TransactionIcon } from './transaction-icon';
import { TransactionTypeIconWrapper } from './transaction-type-icon-wrapper';

type StatusColorMap = Record<StacksTxStatus, string>;

export function getColorFromTx(tx: StacksTx) {
  const colorMap: StatusColorMap = {
    pending: 'warning.label',
    success_microblock: 'stacks',
    success_anchor_block: 'stacks',
    failed: 'error.label',
  };

  return colorMap[statusFromTx(tx)] ?? 'error.label';
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
