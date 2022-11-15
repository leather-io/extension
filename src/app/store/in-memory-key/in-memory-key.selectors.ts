import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';
import { defaultKeyId } from '../keys/key.slice';

const selectInMemoryKey = (state: RootState) => state.inMemoryKeys;

export const selectDefaultWalletKey = createSelector(
  selectInMemoryKey,
  state => state.keys[defaultKeyId]
);

export function useDefaultWalletSecretKey() {
  return useSelector(selectDefaultWalletKey);
}
