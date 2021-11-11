import { atom } from 'jotai';
import { currentNetworkState } from '@store/network/networks';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import {
  currentAccountStxAddressState,
  currentAccountTransactionsState,
} from '@store/accounts/index';
import { makeLocalDataKey } from '@common/store-utils';
import deepEqual from 'fast-deep-equal';
import { safelyFormatHexTxid } from '@common/utils/safe-handle-txid';
import { deserializeTransaction, StacksTransaction } from '@stacks/transactions';

type LocalTx = Record<
  string,
  {
    rawTx: string;
    timestamp: string;
  }
>;
const currentAccountLocallySubmittedTxsRootState = atomFamily<[string, string], LocalTx, LocalTx>(
  ([_address, _network]) =>
    atomWithStorage<LocalTx>(makeLocalDataKey([_address, _network, 'LOCAL_TXS']), {}),
  deepEqual
);

/**
 * @deprecated
 * Use `useCurrentAccountTxIds`
 */
const currentAccountExternalTxIdsState = atom(get => [
  ...new Set([...get(currentAccountTransactionsState).map(tx => tx.tx_id)]),
]);

export const currentAccountLocallySubmittedTxsState = atom<LocalTx, LocalTx>(
  get => {
    const principal = get(currentAccountStxAddressState);
    if (!principal) return {};
    const networkUrl = get(currentNetworkState).url;
    return get(currentAccountLocallySubmittedTxsRootState([principal, networkUrl]));
  },
  (get, set, update) => {
    const principal = get(currentAccountStxAddressState);
    if (!principal) return;
    const networkUrl = get(currentNetworkState).url;
    const anAtom = currentAccountLocallySubmittedTxsRootState([principal, networkUrl]);
    const latestLocalTxs = get(anAtom);
    void set(anAtom, { ...update, ...latestLocalTxs });
  }
);

const currentAccountLocallySubmittedTxIdsState = atom(get => {
  const txs = get(currentAccountLocallySubmittedTxsState);
  const externalTxids = get(currentAccountExternalTxIdsState);
  return txs
    ? Object.entries(txs)
        .filter(([txid]) => !externalTxids.includes(safelyFormatHexTxid(txid)))
        .sort((a, b) => (a[1].timestamp > b[1].timestamp ? -1 : 1))
        .map(([txid]) => txid)
    : [];
});

/** @deprecated */
const currentAccountLocallySubmittedStacksTransactionsState = atom(get => {
  const localTxs = get(currentAccountLocallySubmittedTxsState);
  const txids = get(currentAccountLocallySubmittedTxIdsState);
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
});

/** @deprecated */
export const currentAccountLocallySubmittedLatestNonceState = atom(get => {
  const txids = get(currentAccountLocallySubmittedTxIdsState);
  const latestTxId = txids[0];
  const txs = get(currentAccountLocallySubmittedStacksTransactionsState);
  const nonce = txs[latestTxId]?.transaction?.auth?.spendingCondition?.nonce.toNumber();
  if (typeof nonce !== 'number') return;
  return nonce;
});

export const cleanupLocalTxs = atom(null, (get, set) => {
  const localTxs = get(currentAccountLocallySubmittedTxsState);
  const externalTxids = get(currentAccountExternalTxIdsState);
  const duplicateTxIds = Object.keys(localTxs).filter(txid =>
    externalTxids.includes(safelyFormatHexTxid(txid))
  );
  if (duplicateTxIds.length) {
    const principal = get(currentAccountStxAddressState);
    if (!principal) return;
    const networkUrl = get(currentNetworkState).url;

    const newLocalTxs = {
      ...localTxs,
    };
    duplicateTxIds.forEach(txid => {
      delete newLocalTxs[txid];
    });
    const anAtom = currentAccountLocallySubmittedTxsRootState([principal, networkUrl]);
    set(anAtom, newLocalTxs);
  }
});
