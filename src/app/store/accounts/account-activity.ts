import { atom } from 'jotai';
import { currentNetworkState } from '@app/store/network/networks';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import {
  currentAccountStxAddressState,
  currentAccountTransactionsState,
} from '@app/store/accounts/index';
import { makeLocalDataKey } from '@app/common/store-utils';
import deepEqual from 'fast-deep-equal';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { logger } from '@shared/logger';

type LocalTx = Record<
  string,
  {
    rawTx: string;
    timestamp: string;
  }
>;
const currentAccountLocallySubmittedTxsRootState = atomFamily(
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
    const submittedTxsState = currentAccountLocallySubmittedTxsRootState([principal, networkUrl]);
    const latestLocalTxs = get(submittedTxsState);
    void set(submittedTxsState, { ...update, ...latestLocalTxs });
  }
);

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

export const removeLocalSubmittedTxById = atom(null, (get, set, txIdToRemove: string) => {
  const principal = get(currentAccountStxAddressState);
  if (!principal) {
    logger.error(
      `Cannot remove locally cached submitted tx with no principal. Txid: ${txIdToRemove}`
    );
    return;
  }
  const networkUrl = get(currentNetworkState).url;
  const submittedTxsState = currentAccountLocallySubmittedTxsRootState([principal, networkUrl]);
  const submittedTxMap = get(submittedTxsState);
  const newSubmittedTxState = Object.fromEntries(
    Object.entries(submittedTxMap).filter(([txid]) => txid !== txIdToRemove)
  );
  set(submittedTxsState, newSubmittedTxState);
});
