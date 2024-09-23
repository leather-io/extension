import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { defaultWalletKeyId } from '@shared/utils';
import { decodeText } from '@shared/utils/text-encoding';

import { mnemonicToRootNode } from '@app/common/keychain/keychain';

import { RootState } from '..';

const selectInMemoryKeys = (state: RootState) => state.inMemoryKeys;

const selectDefaultInMemoryWalletKeyBytes = createSelector(
  selectInMemoryKeys,
  state => state.keys[defaultWalletKeyId]
);

const selectHasDefaultInMemoryWalletKey = createSelector(
  selectDefaultInMemoryWalletKeyBytes,
  key => !!key
);

export function useHasDefaultInMemoryWalletSecretKey() {
  return useSelector(selectHasDefaultInMemoryWalletKey);
}

// Not using a memoized "createSelector" to avoid storing the decoded key as cleartext in memory
export const selectDefaultWalletKey = (state: RootState) => {
  const defaultWalletBytes = selectDefaultInMemoryWalletKeyBytes(state);

  if (!defaultWalletBytes) return null;

  return decodeText(defaultWalletBytes);
};

export const selectRootKeychain = createSelector(
  selectDefaultInMemoryWalletKeyBytes,
  defaultKey => {
    if (!defaultKey) return null;

    return mnemonicToRootNode(decodeText(defaultKey));
  }
);

export function useDefaultWalletSecretKey() {
  return useSelector(selectDefaultWalletKey);
}
