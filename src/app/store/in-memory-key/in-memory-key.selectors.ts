import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { mnemonicToRootNode } from '@app/common/keychain/keychain';

import { RootState } from '..';
import { defaultKeyId } from '../keys/key.slice';

const selectInMemoryKey = (state: RootState) => state.inMemoryKeys;

export const selectDefaultWalletKey = createSelector(
  selectInMemoryKey,
  state => state.keys[defaultKeyId]
);

export const selectRootKeychain = createSelector(selectDefaultWalletKey, state => {
  if (!state) return null;
  return mnemonicToRootNode(state);
});

export function useDefaultWalletSecretKey() {
  return useSelector(selectDefaultWalletKey);
}
