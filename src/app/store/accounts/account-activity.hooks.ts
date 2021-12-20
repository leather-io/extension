import { useAtomCallback, useAtomValue, useUpdateAtom } from 'jotai/utils';
import {
  cleanupLocalTxs,
  currentAccountLocallySubmittedTxsState,
  removeLocalSubmittedTxById,
} from '@app/store/accounts/account-activity';
import { deserializeTransaction, StacksTransaction } from '@stacks/transactions';

import { useCallback } from 'react';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { useCurrentAccountTxIds } from '@app/query/transactions/transaction.hooks';

export function useCurrentAccountLocalTxids() {
  const txs = useAtomValue(currentAccountLocallySubmittedTxsState);
  const externalTxids = useCurrentAccountTxIds();
  return txs
    ? Object.entries(txs)
        .filter(([txid]) => !externalTxids.includes(safelyFormatHexTxid(txid)))
        .sort((a, b) => (a[1].timestamp > b[1].timestamp ? -1 : 1))
        .map(([txid]) => txid)
    : [];
}

export function useCurrentAccountLocallySubmittedStacksTransactions() {
  const localTxs = useAtomValue(currentAccountLocallySubmittedTxsState);
  const txids = useCurrentAccountLocalTxids();
  const result: any = {};
  txids.forEach(txid => {
    result[txid] = {
      transaction: deserializeTransaction(localTxs[txid].rawTx),
      timestamp: localTxs[txid].timestamp,
    };
  });
  return result as Record<
    string,
    {
      transaction: StacksTransaction;
      timestamp: number;
    }
  >;
}

export function useSetLocalTxsCallback() {
  return useAtomCallback<
    void,
    {
      txid: string;
      rawTx: string;
      timestamp: string;
    }
  >(
    useCallback(async (_get, set, arg) => {
      await set(currentAccountLocallySubmittedTxsState, {
        [arg.txid]: {
          timestamp: arg.timestamp,
          rawTx: arg.rawTx,
        },
      });
    }, [])
  );
}

export function useCurrentAccountLocalStacksTransaction(tx_id: string) {
  const txs = useCurrentAccountLocallySubmittedStacksTransactions();
  return txs[tx_id];
}

export function useCleanupLocalTxsCallback() {
  return useUpdateAtom(cleanupLocalTxs);
}

export function useRemoveLocalSubmittedTxById() {
  return useUpdateAtom(removeLocalSubmittedTxById);
}
