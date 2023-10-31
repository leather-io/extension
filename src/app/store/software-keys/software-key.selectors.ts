import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { defaultWalletKeyId } from '@shared/utils';

import { initialSearchParams } from '@app/common/initial-search-params';
import { initBigNumber } from '@app/common/math/helpers';
import { RootState } from '@app/store';

import { selectStacksChain } from '../chains/stx-chain.selectors';

const selectKeysSlice = (state: RootState) => state['softwareKeys'];

export const selectDefaultSoftwareKey = createSelector(
  selectKeysSlice,
  state => state.entities[defaultWalletKeyId]
);

export function useCurrentKeyDetails() {
  return useSelector(selectDefaultSoftwareKey);
}

export const selectCurrentAccountIndex = createSelector(selectStacksChain, state => {
  const customAccountIndex = initialSearchParams.get('accountIndex');
  if (customAccountIndex && initBigNumber(customAccountIndex).isInteger()) {
    return initBigNumber(customAccountIndex).toNumber();
  }
  return state[defaultWalletKeyId].currentAccountIndex;
});
