import { addressToString, PayloadType, StacksTransaction } from '@stacks/transactions';
import { BoxProps, DynamicColorCircle } from '@stacks/ui';

import { StxIcon } from '@app/components/icons/stx-icon';
import { Tx } from '@app/common/api/transactions';
import { getTxSenderAddress } from '@app/common/transactions/transaction-utils';

import { TransactionTypeIcon } from './transaction-type-icon';
import { TransactionIconWrapper } from './transaction-icon-wrapper';

interface StacksTransactionIconProps extends BoxProps {
  transaction: StacksTransaction;
}
export function StacksTransactionIcon({ transaction, ...rest }: StacksTransactionIconProps) {
  switch (transaction.payload.payloadType) {
    case PayloadType.SmartContract:
      return (
        <DynamicColorCircle
          position="relative"
          string={`${getTxSenderAddress(transaction)}.${transaction.payload.contractName.content}`}
          backgroundSize="200%"
          size="36px"
          {...rest}
        >
          <TransactionTypeIcon
            transaction={{ tx_type: 'smart_contract', tx_status: 'pending' } as Tx}
          />
        </DynamicColorCircle>
      );
    case PayloadType.ContractCall:
      return (
        <DynamicColorCircle
          position="relative"
          string={`${addressToString(transaction.payload.contractAddress)}.${
            transaction.payload.contractName.content
          }::${transaction.payload.functionName.content}`}
          backgroundSize="200%"
          size="36px"
          {...rest}
        >
          <TransactionTypeIcon
            transaction={{ tx_type: 'contract_call', tx_status: 'pending' } as Tx}
          />
        </DynamicColorCircle>
      );
    case PayloadType.TokenTransfer:
      return (
        <TransactionIconWrapper
          icon={StxIcon}
          transaction={{ tx_type: 'token_transfer', tx_status: 'pending' } as Tx}
          {...rest}
        />
      );
    default:
      return null;
  }
}
