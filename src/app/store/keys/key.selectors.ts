import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app/store';

import { defaultKeyId } from './key.slice';

const selectWalletSlice = (state: RootState) => state.keys;

export const selectCurrentKey = createSelector(
  selectWalletSlice,
  state => state.entities[defaultKeyId]
);

export function useCurrentKeyDetails() {
  return useSelector(selectCurrentKey);
}
