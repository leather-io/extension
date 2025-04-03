import { useMemo } from 'react';

import { deserializeTransaction } from '@stacks/transactions';

import { isUndefined } from '@leather.io/utils';

import { useGetRawTransactionByIdQuery } from './raw-transaction-by-id.query';

const rawTxCache = new Map();

export function useStacksRawTransaction(txid: string) {
  const { data: rawTxData, isLoading: isLoadingRawTx } = useGetRawTransactionByIdQuery(txid);

  return useMemo(() => {
    if (isUndefined(rawTxData)) return { isLoadingRawTx, rawTx: undefined };
    const match = rawTxCache.get(txid);
    if (match) return { isLoadingRawTx, rawTx: deserializeTransaction(match) };
    rawTxCache.set(txid, rawTxData.raw_tx);
    return { isLoadingRawTx, rawTx: deserializeTransaction(rawTxData.raw_tx) };
  }, [isLoadingRawTx, rawTxData, txid]);
}
