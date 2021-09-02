import { broadcastRawTransaction } from '@stacks/transactions';
import {
  STXTransferPayload,
  TransactionTypes,
  ContractCallPayload,
  ContractDeployPayload,
} from '@stacks/connect';
import {
  generateContractCallTx,
  generateContractDeployTx,
  generateSTXTransferTx,
} from '@common/transactions/transaction-utils';
import { Buffer } from 'buffer';
import { validateTxId } from '@common/validation/validate-tx-id';

interface BroadcastTransactionOptions {
  txRaw: string;
  serialized: Buffer;
  isSponsored: boolean;
  attachment?: string;
  networkUrl: string;
}

export async function handleBroadcastTransaction(options: BroadcastTransactionOptions) {
  const { txRaw, serialized, isSponsored, attachment, networkUrl } = options;
  // if sponsored, return raw tx
  if (isSponsored)
    return {
      txRaw,
    };
  const response = await broadcastRawTransaction(
    serialized,
    `${networkUrl}/v2/transactions`,
    attachment ? Buffer.from(attachment, 'hex') : undefined
  );

  if (typeof response === 'string') {
    const isValidTxId = validateTxId(response);
    if (isValidTxId)
      return {
        txId: response,
        txRaw,
      };
    console.error(`Error broadcasting raw transaction -- ${response}`);
    throw new Error(response);
  } else {
    console.error('Error broadcasting raw transaction');
    const error = `${response.error} - ${response.reason}`;
    console.error(error);
    throw new Error(error);
  }
}

function getIsValid(txType: TransactionTypes) {
  return (
    txType === TransactionTypes.STXTransfer ||
    txType === TransactionTypes.ContractCall ||
    txType === TransactionTypes.ContractDeploy
  );
}

export type ContractCallOptions = Pick<
  ContractCallPayload,
  | 'txType'
  | 'contractName'
  | 'contractAddress'
  | 'functionName'
  | 'functionArgs'
  | 'sponsored'
  | 'postConditionMode'
  | 'postConditions'
  | 'network'
>;

export interface TokenTransferOptions {
  txType: TransactionTypes.STXTransfer;
  recipient: STXTransferPayload['recipient'];
  memo: STXTransferPayload['memo'];
  amount: STXTransferPayload['amount'];
  network: STXTransferPayload['network'];
}

export type ContractDeployOptions = Pick<
  ContractDeployPayload,
  'txType' | 'contractName' | 'codeBody' | 'postConditions' | 'postConditionMode' | 'network'
>;

export interface GenerateSignedTransactionOptions {
  txData: ContractCallOptions | TokenTransferOptions | ContractDeployOptions;
  senderKey: string;
  nonce?: number;
  fee?: number;
}

export async function generateSignedTransaction(options: GenerateSignedTransactionOptions) {
  const { txData, senderKey, nonce, fee = 0 } = options;
  const isValid = getIsValid(txData.txType);

  if (!isValid) throw new Error(`Invalid Transaction Type: ${txData.txType}`);

  switch (txData.txType) {
    case TransactionTypes.ContractCall:
      return generateContractCallTx({ txData, senderKey, nonce, fee });
    case TransactionTypes.ContractDeploy:
      return generateContractDeployTx({ txData, senderKey, nonce, fee });
    case TransactionTypes.STXTransfer:
      return generateSTXTransferTx({ txData, senderKey, nonce, fee });
    default:
      break;
  }
  throw new Error(`Could not sign transaction.`);
}
