import { FiAlertOctagon, FiList } from 'react-icons/fi';

import { BoxProps, DynamicColorCircle } from '@stacks/ui';

import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';
import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { BtcIcon } from '@app/components/icons/btc-icon';
import { StxIcon } from '@app/components/icons/stx-icon';
import { TransactionIconWrapper } from '@app/components/transaction/transaction-icon-wrapper';

import { TransactionTypeIcon } from '../transaction/transaction-type-icon';

interface TransactionIconProps extends BoxProps {
  transaction: BitcoinTransaction;
}
export function BitcoinTransactionIcon({ transaction, ...rest }: TransactionIconProps) {
  switch (transaction.tx_type) {
    case 'coinbase':
      return <TransactionIconWrapper icon={FiList} transaction={transaction} {...rest} />;
    case 'token_transfer':
      return <TransactionIconWrapper icon={BtcIcon} transaction={transaction} {...rest} />;
    case 'poison_microblock':
      return <TransactionIconWrapper icon={FiAlertOctagon} transaction={transaction} {...rest} />;
    default:
      return null;
  }
}
