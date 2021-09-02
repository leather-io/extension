import { atom } from 'jotai';
import { apiClientState } from '@store/common/api-clients';
import {
  deserializeTransaction,
  createStacksPrivateKey,
  TransactionSigner,
} from '@stacks/transactions';
import { currentAccountPrivateKeyState } from '@store/accounts';
import { updateTransactionFee } from '@store/transactions/utils';
import { customAbsoluteTxFee, feeRateState } from '@store/transactions/fees';
import BN from 'bn.js';

export const rawTxIdState = atom<string | null>(null);

const rawTxCache = new Map();

export const rawTxState = atom(get => {
  const txId = get(rawTxIdState);
  if (!txId) return;
  const match = rawTxCache.get(txId);
  // no need to fetch again
  if (match) return match;
  const { transactionsApi } = get(apiClientState);
  return transactionsApi.getRawTransactionById({ txId }).then(result => {
    const rawTx = result.raw_tx;
    rawTxCache.set(txId, rawTx);
    return rawTx;
  });
});

export const rawStacksTransactionState = atom(get => {
  const rawTx = get(rawTxState);
  if (!rawTx) return;
  return deserializeTransaction(rawTx);
});

export const rawStacksTransactionByteSizeState = atom(get => {
  const transaction = get(rawStacksTransactionState);
  return transaction?.serialize().byteLength || 0;
});

export const rawSignedStacksTransactionState = atom(get => {
  const transaction = get(rawStacksTransactionState);
  const privateKey = get(currentAccountPrivateKeyState);
  if (!transaction || !privateKey) return;
  const feeRate = get(feeRateState);
  const absoluteCustomFee = get(customAbsoluteTxFee);
  const updatedTx = updateTransactionFee(transaction, feeRate);
  if (absoluteCustomFee) {
    updatedTx.setFee(new BN(absoluteCustomFee));
  }
  const signer = new TransactionSigner(updatedTx);
  signer.signOrigin(createStacksPrivateKey(privateKey));
  return transaction;
});
