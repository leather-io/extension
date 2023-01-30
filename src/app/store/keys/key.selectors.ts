import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app/store';

import { selectStacksChain } from '../chains/stx-chain.selectors';
import { defaultKeyId } from './key.slice';

export const selectKeysSlice = (state: RootState) => state.keys;

export const selectCurrentKey = createSelector(
  selectKeysSlice,
  state => state.entities[defaultKeyId]
);

export function useCurrentKeyDetails() {
  return useSelector(selectCurrentKey);
}

export const selectCurrentAccountIndex = createSelector(selectStacksChain, state => {
  return state[defaultKeyId].currentAccountIndex;
});

export const selectLedgerKey = createSelector(selectKeysSlice, keys => {
  if (!keys.entities.default) return;
  if (keys.entities.default.type !== 'ledger') return;
  return keys.entities.default;
});
