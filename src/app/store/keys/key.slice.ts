import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateSecretKey } from '@stacks/wallet-sdk';

import { migrateVaultReducerStoreToNewStateStructure } from '../utils/vault-reducer-migration';

export const defaultKeyId = 'default' as const;

interface KeyConfigSoftware {
  type: 'software';
  id: string;
  encryptedSecretKey: string;
  salt: string;
}

const keyAdapter = createEntityAdapter<KeyConfigSoftware>();

// Only used during onboarding, pre-wallet creation
// Could well be persisted elsewhere
interface ExtraKeyState {
  secretKey?: null | string;
}

export const initialKeysState = keyAdapter.getInitialState<ExtraKeyState>({ secretKey: null });

export const keySlice = createSlice({
  name: 'keys',
  initialState: migrateVaultReducerStoreToNewStateStructure(initialKeysState),
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

    createNewWalletComplete(state, action: PayloadAction<KeyConfigSoftware>) {
      state.secretKey = null;
      keyAdapter.addOne(state, action.payload);
    },

    signOut(state) {
      keyAdapter.removeOne(state, defaultKeyId);
    },
  },
});
