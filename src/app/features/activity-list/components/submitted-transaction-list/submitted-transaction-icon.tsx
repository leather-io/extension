import { PayloadType, StacksTransaction, addressToString } from '@stacks/transactions';
// #4164 FIXME migrate DynamicColorCircle
import { DynamicColorCircle } from '@stacks/ui';
import { BoxProps } from 'leather-styles/jsx';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { getTxSenderAddress } from '@app/common/transactions/stacks/transaction.utils';
import { StxIcon } from '@app/components/icons/stx-icon';
import { TransactionIconWrapper } from '@app/components/transaction/transaction-icon-wrapper';
import { TransactionTypeIcon } from '@app/components/transaction/transaction-type-icon';

interface SubmittedTransactionIconProps extends BoxProps {
  transaction: StacksTransaction;
}
export function SubmittedTransactionIcon({ transaction, ...rest }: SubmittedTransactionIconProps) {
  switch (transaction.payload.payloadType) {
    case PayloadType.SmartContract:
      return (
        <DynamicColorCircle
          position="relative"
          string={`${getTxSenderAddress(transaction)}.${transaction.payload.contractName.content}`}
          backgroundSize="200%"
          size="36px"
        >
          <TransactionTypeIcon
            transaction={
              {
                tx_type: 'smart_contract',
                tx_status: 'pending',
              } as StacksTx
            }
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
        >
          <TransactionTypeIcon
            transaction={
              {
                tx_type: 'contract_call',
                tx_status: 'pending',
              } as StacksTx
            }
          />
        </DynamicColorCircle>
      );
    case PayloadType.TokenTransfer:
      return (
        <TransactionIconWrapper
          icon={StxIcon}
          transaction={
            {
              tx_type: 'token_transfer',
              tx_status: 'pending',
            } as StacksTx
          }
          {...rest}
        />
      );
    default:
      return null;
  }
}
