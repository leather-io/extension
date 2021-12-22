import { atom } from 'jotai';

import { deserializeTransaction } from '@stacks/transactions';
import { apiClientState } from '@app/store/common/api-clients';

export const rawTxIdState = atom<string | null>(null);

const rawTxCache = new Map();

const rawTxState = atom<string>(get => {
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

export const rawDeserializedTxState = atom(get => {
  const rawTx = get(rawTxState);
  if (!rawTx) return;
  return deserializeTransaction(rawTx);
});
