import { useSelector } from 'react-redux';
import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateSecretKey } from '@stacks/wallet-sdk';

import { RootState } from '../root-reducer';

export interface KeyConfigSoftware {
  type: 'software';
  id: string;
  encryptedSecretKey: string;
  salt: string;
  // Legacy property from pre-vault reducer refactor. A wallet never arrives to
  // the state prior to there being a password set for the key's encryption.
  // `hasSetPassword` can later be inferred on the presence of an encryptedKey
  // property.
  hasSetPassword: boolean;
  secretKey: string;
}

const keyAdapter = createEntityAdapter<KeyConfigSoftware>();

// Only used during onboarding, pre-wallet creation
// Could well be persisted elsewhere
interface TempKeyState {
  secretKey?: null | string;
}

export const keySlice = createSlice({
  name: 'keys',
  initialState: keyAdapter.getInitialState<TempKeyState>({ secretKey: null }),
  reducers: {
    generateWalletKey(state) {
      state.secretKey = generateSecretKey(256);
    },

    saveUsersSecretKeyToBeRestored(state, action: PayloadAction<string>) {
      state.secretKey = action.payload;
    },

    clearWalletKey(state) {
      state.secretKey = null;
    },

    addNewKey(state, action: PayloadAction<KeyConfigSoftware>) {
      state.secretKey = null;
      keyAdapter.addOne(state, action.payload);
    },

    updateCurrentWallet: keyAdapter.updateOne,

    lockWallet(state) {
      keyAdapter.updateOne(state, { id: 'default', changes: { secretKey: null } as any });
    },

    signOut(state) {
      keyAdapter.removeOne(state, 'default');
    },
  },
});

const selectWalletSlice = (state: RootState) => state.keys;

export const selectGeneratedSecretKey = createSelector(selectWalletSlice, state => state.secretKey);

export const selectCurrentKey = createSelector(selectWalletSlice, state => state.entities.default);

export function useCurrentKey() {
  return useSelector(selectCurrentKey);
}
