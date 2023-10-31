import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';
import { BoxProps } from 'leather-styles/jsx';

import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';
import { TransactionTransfers } from '@app/features/activity-list/components/transaction-list/stacks-transaction/transaction-transfers';

interface StacksTransactionProps extends BoxProps {
  transaction: AddressTransactionWithTransfers;
}
export function StacksTransaction({ transaction, ...rest }: StacksTransactionProps) {
  // Show transfer only for contract calls
  if (transaction.tx.tx_type !== 'contract_call')
    return <StacksTransactionItem transaction={transaction.tx} {...rest} />;

  return (
    <>
      <TransactionTransfers transaction={transaction} />
      <StacksTransactionItem transaction={transaction.tx} {...rest} />
    </>
  );
}
