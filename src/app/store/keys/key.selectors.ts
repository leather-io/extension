import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { RootState } from '@app/store';
import { defaultKeyId } from './key.slice';

const selectWalletSlice = (state: RootState) => state.keys;

export const selectGeneratedSecretKey = createSelector(selectWalletSlice, state => state.secretKey);

export const selectCurrentKey = createSelector(
  selectWalletSlice,
  state => state.entities[defaultKeyId]
);

export function useCurrentKeyDetails() {
  return useSelector(selectCurrentKey);
}

export function useGeneratedSecretKey() {
  return useSelector(selectGeneratedSecretKey);
}
