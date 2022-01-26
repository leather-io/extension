import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '..';

const selectInMemoryKey = (state: RootState) => state.inMemoryKeys;

export const selectDefaultWalletKey = createSelector(
  selectInMemoryKey,
  state => state.keys.default
);

export function useDefaultWalletSecretKey() {
  return useSelector(selectDefaultWalletKey);
}
