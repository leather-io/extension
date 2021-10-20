import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { decodeToken } from 'jsontokens';

import { TransactionPayload } from '@stacks/connect';
import { StacksTransaction } from '@stacks/transactions';

export function getPayloadFromToken(requestToken: string) {
  const token = decodeToken(requestToken);
  return token.payload as unknown as TransactionPayload;
}

function calculateFeeFromFeeRate(tx: StacksTransaction, feeRate: number) {
  const txBytes = new BigNumber(tx.serialize().byteLength);
  return txBytes.multipliedBy(feeRate);
}

export function updateTransactionFee(transaction: StacksTransaction, feeRate: number) {
  const newFee = calculateFeeFromFeeRate(transaction, feeRate);
  transaction.setFee(new BN(newFee.toNumber()));
  return transaction;
}
