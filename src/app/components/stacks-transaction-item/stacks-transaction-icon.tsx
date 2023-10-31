import { BoxProps } from 'leather-styles/jsx';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { StxIcon } from '@app/ui/components/icons/stx-icon';

import { DynamicColorCircle } from '../../ui/components/dynamic-color-circle';
import { AlertOctagonIcon } from '../icons/alert-octagon-icon';
import { ListIcon } from '../icons/list-icon';
import { TransactionIconWrapper } from '../transaction/transaction-icon-wrapper';
import { TransactionTypeIcon } from '../transaction/transaction-type-icon';

interface TransactionIconProps extends BoxProps {
  transaction: StacksTx;
}
export function StacksTransactionIcon({ transaction, ...rest }: TransactionIconProps) {
  switch (transaction.tx_type) {
    case 'coinbase':
      return <TransactionIconWrapper icon={<ListIcon />} transaction={transaction} {...rest} />;
    case 'smart_contract':
      return (
        <DynamicColorCircle
          position="relative"
          value={`${transaction.smart_contract.contract_id}`}
          {...rest}
        >
          <TransactionTypeIcon transaction={transaction} />
        </DynamicColorCircle>
      );
    case 'contract_call':
      return (
        <DynamicColorCircle
          position="relative"
          value={`${transaction.contract_call.contract_id}::${transaction.contract_call.function_name}`}
          {...rest}
        >
          <TransactionTypeIcon transaction={transaction} />
        </DynamicColorCircle>
      );
    case 'token_transfer':
      return <TransactionIconWrapper icon={<StxIcon />} transaction={transaction} {...rest} />;
    case 'poison_microblock':
      return (
        <TransactionIconWrapper icon={<AlertOctagonIcon />} transaction={transaction} {...rest} />
      );
    default:
      return null;
  }
}
