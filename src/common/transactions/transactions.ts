import { broadcastRawTransaction } from '@stacks/transactions';
import { STXTransferPayload, TransactionTypes } from '@stacks/connect';
import {
  generateContractCallTx,
  generateContractDeployTx,
  generateSTXTransferTx,
} from '@common/transactions/transaction-utils';
import { Buffer } from 'buffer';
import { validateTxId } from '@common/validation/validate-tx-id';
import {
  ContractCallPayload,
  ContractDeployPayload,
} from '@stacks/connect/dist/types/types/transactions';
import BN from 'bn.js';
import { isNumber, isString } from '@common/utils';

function safelyExtractFeeValue(fee: unknown) {
  if (fee === '') return undefined;
  if (!isNumber(fee) && !isString(fee)) return undefined;
  if (!Number.isFinite(parseInt(String(fee)))) return undefined;
  return new BN(fee, 10);
}

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
> & { fee?: number | string | BN };

export interface TokenTransferOptions {
  txType: TransactionTypes.STXTransfer;
  recipient: STXTransferPayload['recipient'];
  memo: STXTransferPayload['memo'];
  amount: STXTransferPayload['amount'];
  network: STXTransferPayload['network'];
  fee?: number | string | BN;
}

export type ContractDeployOptions = Pick<
  ContractDeployPayload,
  'txType' | 'contractName' | 'codeBody' | 'postConditions' | 'postConditionMode' | 'network'
> & { fee?: number | string | BN };

interface GenerateSignedTransactionOptions {
  txData: ContractCallOptions | TokenTransferOptions | ContractDeployOptions;
  senderKey: string;
  nonce?: number;
  fee?: number;
}

export async function generateSignedTransaction(options: GenerateSignedTransactionOptions) {
  const { txData, senderKey, nonce } = options;
  const isValid = getIsValid(txData.txType);

  if (!isValid) throw new Error(`Invalid Transaction Type: ${txData.txType}`);

  // TODO: how to overwrite
  const customAppFee = safelyExtractFeeValue(txData.fee);
  const fee = customAppFee?.toNumber() || options.fee;

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
