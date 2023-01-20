import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app/store';

import { defaultKeyId } from './key.slice';

export const selectKeysSlice = (state: RootState) => state.keys;

export const selectCurrentKey = createSelector(
  selectKeysSlice,
  state => state.entities[defaultKeyId]
);

export function useCurrentKeyDetails() {
  return useSelector(selectCurrentKey);
}
