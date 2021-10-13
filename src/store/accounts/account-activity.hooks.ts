import { useAtomCallback, useAtomValue, useUpdateAtom } from 'jotai/utils';
import {
  cleanupLocalTxs,
  currentAccountExternalTxIdsState,
  currentAccountLocallySubmittedStacksTransactionsState,
  currentAccountLocallySubmittedTxIdsState,
  currentAccountLocallySubmittedTxsState,
} from '@store/accounts/account-activity';

import { useCallback } from 'react';

export const useCurrentAccountLocalTxids = () => {
  return useAtomValue(currentAccountLocallySubmittedTxIdsState);
};

export const useSetLocalTxsCallback = () =>
  useAtomCallback<
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

export const useCurrentAccountLocalStacksTransaction = (tx_id: string) => {
  const txs = useAtomValue(currentAccountLocallySubmittedStacksTransactionsState);
  return txs[tx_id];
};

export const useCleanupLocalTxsCallback = () => useUpdateAtom(cleanupLocalTxs);

export const useCurrentAccountTxIdsState = () => useAtomValue(currentAccountExternalTxIdsState);
