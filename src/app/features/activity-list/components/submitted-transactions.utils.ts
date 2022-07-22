import { PayloadType, StacksTransaction } from '@stacks/transactions';

import { Tx } from '@app/common/api/transactions';
import { stacksValue } from '@app/common/stacks-utils';
import { getTxCaption } from '@app/common/transactions/transaction-utils';

interface SubmittedTransactionDetails {
  caption: string | null;
  title: string;
  value: string | null;
}

interface GetSubmittedTransactionDetailsArgs {
  payload: StacksTransaction['payload'];
  senderAddress?: string;
  txId: string;
}
export function getSubmittedTransactionDetails({
  payload,
  senderAddress,
  txId,
}: GetSubmittedTransactionDetailsArgs): SubmittedTransactionDetails | null {
  switch (payload.payloadType) {
    case PayloadType.TokenTransfer:
      return {
        caption: getTxCaption({
          tx_type: 'token_transfer',
          tx_id: txId,
        } as Tx),
        title: 'Stacks Token',
        value: `-${stacksValue({
          value: Number(payload.amount),
          withTicker: false,
        })}`,
      };
    case PayloadType.ContractCall:
      return {
        caption: getTxCaption({
          tx_type: 'contract_call',
          contract_call: {
            contract_id: `.${payload.contractName.content}`,
          },
        } as unknown as Tx),
        title: payload.functionName.content,
        value: null,
      };
    case PayloadType.SmartContract:
      return {
        caption: getTxCaption({
          tx_type: 'smart_contract',
          smart_contract: {
            contract_id: `${senderAddress}.${payload.contractName.content}`,
          },
        } as unknown as Tx),
        title: payload.contractName.content,
        value: null,
      };
    default:
      return null;
  }
}
