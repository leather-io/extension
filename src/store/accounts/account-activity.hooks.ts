import { useAtomCallback, useAtomValue } from 'jotai/utils';
import {
  currentAccountAllTxIds,
  currentAccountLocallySubmittedStacksTransactionsState,
  currentAccountLocallySubmittedTxIdsState,
  currentAccountLocallySubmittedTxsState,
} from '@store/accounts/account-activity';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

export const useCurrentAccountTxids = () => {
  return useAtomValue(currentAccountAllTxIds);
};

export const useCurrentAccountLocalTxids = () => {
  return useAtomValue(currentAccountLocallySubmittedTxIdsState);
};

export const useCurrentAccountLocalTxs = () => {
  return useAtom(currentAccountLocallySubmittedTxsState);
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
