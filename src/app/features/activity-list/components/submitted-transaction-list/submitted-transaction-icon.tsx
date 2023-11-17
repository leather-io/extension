import { PayloadType, StacksTransaction, addressToString } from '@stacks/transactions';
import { CircleProps } from 'leather-styles/jsx';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { getTxSenderAddress } from '@app/common/transactions/stacks/transaction.utils';
import { TransactionIconWrapper } from '@app/components/transaction/transaction-icon-wrapper';
import { TransactionTypeIcon } from '@app/components/transaction/transaction-type-icon';
import { DynamicColorCircle } from '@app/ui/components/dynamic-color-circle';
import { StxIcon } from '@app/ui/components/icons/stx-icon';

interface SubmittedTransactionIconProps extends CircleProps {
  transaction: StacksTransaction;
}
export function SubmittedTransactionIcon({ transaction, ...rest }: SubmittedTransactionIconProps) {
  switch (transaction.payload.payloadType) {
    case PayloadType.SmartContract:
      return (
        <DynamicColorCircle
          position="relative"
          value={`${getTxSenderAddress(transaction)}.${transaction.payload.contractName.content}`}
          {...rest}
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
          value={`${addressToString(transaction.payload.contractAddress)}.${
            transaction.payload.contractName.content
          }::${transaction.payload.functionName.content}`}
          {...rest}
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
          icon={<StxIcon />}
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
