import type { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';
import { BoxProps } from '@stacks/ui';

import { Tx } from '@app/common/api/transactions';
import { isAddressTransactionWithTransfers } from '@app/common/transactions/transaction-utils';

import { TransactionItem } from './components/transaction-item';
import { TransactionTransfers } from './components/transaction-transfers';

interface TransactionProps extends BoxProps {
  transaction: AddressTransactionWithTransfers | Tx;
}
export const Transaction = ({ transaction, ...rest }: TransactionProps) => {
  if (!isAddressTransactionWithTransfers(transaction))
    // This is a normal MempoolTransaction or Transaction
    return <TransactionItem transaction={transaction} {...rest} />;

  // Show transfer only for contract calls
  if (transaction.tx.tx_type !== 'contract_call')
    return <TransactionItem transaction={transaction.tx} {...rest} />;

  return (
    <>
      <TransactionTransfers transaction={transaction} />
      <TransactionItem transaction={transaction.tx} {...rest} />
    </>
  );
};
