import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app/store';

export const selectStacksChain = (state: RootState) => state.chains.stx;

export const selectHighestAccountIndex = createSelector(
  selectStacksChain,
  state => state.default.highestAccountIndex
);
