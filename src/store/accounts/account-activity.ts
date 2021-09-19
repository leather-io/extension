import { atom } from 'jotai';
import { currentNetworkState } from '@store/network/networks';
import { deserializeTransaction, StacksTransaction } from '@stacks/transactions';
import { atomFamily } from 'jotai/utils';
import {
  currentAccountStxAddressState,
  currentAccountTransactionsState,
} from '@store/accounts/index';

export const currentAccountExternalTxIdsState = atom(get => [
  ...new Set([...get(currentAccountTransactionsState).map(tx => tx.tx_id)]),
]);
export const currentAccountLocallySubmittedTxsRootState = atomFamily<
  [string, string],
  Record<string, string>,
  Record<string, string>
>(([_address, _network]) => atom<Record<string, string>>({}));

export const currentAccountLocallySubmittedTxsState = atom<
  Record<string, string>,
  Record<string, string>
>(
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
    void set(currentAccountLocallySubmittedTxsRootState([principal, networkUrl]), update);
  }
);

export const currentAccountLocallySubmittedTxIdsState = atom(get => {
  const txs = get(currentAccountLocallySubmittedTxsState);
  return txs ? Object.keys(txs) : [];
});

export const currentAccountLocallySubmittedStacksTransactionsState = atom(get => {
  const localTxs = get(currentAccountLocallySubmittedTxsState);
  const txids = get(currentAccountLocallySubmittedTxIdsState);
  const result: any = {};
  txids.forEach(txid => {
    result[txid] = deserializeTransaction(localTxs[txid]);
  });
  return result as Record<string, StacksTransaction>;
});

export const currentAccountAllTxIds = atom(get => {
  const localTxids = get(currentAccountLocallySubmittedTxIdsState);
  const externalTxids = get(currentAccountExternalTxIdsState);
  return [...new Set([...localTxids, ...externalTxids])];
});
