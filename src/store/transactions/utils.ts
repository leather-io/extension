import { StacksTransaction } from '@stacks/transactions';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { decodeToken } from 'jsontokens';
import {
  ContractCallPayload,
  ContractDeployPayload,
  STXTransferPayload,
  TransactionTypes,
} from '@stacks/connect';
import { TransactionPayloadWithAttachment } from '@store/transactions/index';

export function getPayloadFromToken(requestToken: string) {
  if (!requestToken) return undefined;
  const token = decodeToken(requestToken);
  const payload = token.payload as unknown as TransactionPayloadWithAttachment;

  if (payload.txType === TransactionTypes.ContractCall)
    return payload as ContractCallPayload & {
      attachment?: string;
      fee?: string | number;
    };
  if (payload.txType === TransactionTypes.ContractDeploy)
    return payload as ContractDeployPayload & {
      attachment?: string;
      fee?: string | number;
    };
  if (payload.txType === TransactionTypes.STXTransfer)
    return payload as STXTransferPayload & {
      attachment?: string;
      fee?: string | number;
    };
  return payload;
}

export function getTxByteLength(tx: StacksTransaction) {
  return new BigNumber(tx.serialize().byteLength);
}

export function calculateDefaultFee(tx: StacksTransaction, feeRate: number) {
  const txBytes = new BigNumber(tx.serialize().byteLength);
  return txBytes.multipliedBy(feeRate);
}

export function getUpdatedTransactionFee(tx: StacksTransaction, _feeRate: number) {
  const txBytes = new BigNumber(tx.serialize().byteLength);
  const feeRate = new BigNumber(_feeRate);
  const newFee = feeRate.multipliedBy(txBytes);
  return new BN(newFee.toNumber());
}

export function updateTransactionFee(transaction: StacksTransaction, _feeRate: number) {
  const txBytes = new BigNumber(transaction.serialize().byteLength);
  const feeRate = new BigNumber(_feeRate);
  const newFee = feeRate.multipliedBy(txBytes);
  transaction.setFee(new BN(newFee.toNumber()));
  return transaction;
}
