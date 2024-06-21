import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { initBigNumber } from '@leather.io/utils';

import { defaultWalletKeyId } from '@shared/utils';

import { initialSearchParams } from '@app/common/initial-search-params';
import { RootState } from '@app/store';

import { selectStacksChain } from '../chains/stx-chain.selectors';

const selectKeysSlice = (state: RootState) => state['softwareKeys'];

export const selectDefaultSoftwareKey = createSelector(
  selectKeysSlice,
  state => state.entities[defaultWalletKeyId]
);

export const selectHasSecretKey = createSelector(
  selectDefaultSoftwareKey,
  softwareKey => !!softwareKey?.encryptedSecretKey
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
