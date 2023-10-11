import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { defaultWalletKeyId } from '@shared/utils';

import { mnemonicToRootNode } from '@app/common/keychain/keychain';

import { RootState } from '..';

const selectInMemoryKey = (state: RootState) => state.inMemoryKeys;

export const selectDefaultWalletKey = createSelector(
  selectInMemoryKey,
  state => state.keys[defaultWalletKeyId]
);

export const selectRootKeychain = createSelector(selectDefaultWalletKey, key => {
  if (!key) return null;
  return mnemonicToRootNode(key);
});

export function useDefaultWalletSecretKey() {
  return useSelector(selectDefaultWalletKey);
}
