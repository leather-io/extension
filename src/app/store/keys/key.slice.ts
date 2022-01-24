import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateSecretKey } from '@stacks/wallet-sdk';

import { migrateVaultReducerStoreToNewStateStructure } from '../utils/vault-reducer-migration';

interface KeyConfigSoftware {
  type: 'software';
  id: string;
  encryptedSecretKey: string;
  salt: string;
  secretKey: string;
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

    unlockWalletComplete(state, action: PayloadAction<Partial<KeyConfigSoftware>>) {
      keyAdapter.updateOne(state, { id: 'default', changes: action.payload });
    },

    lockWallet(state) {
      keyAdapter.updateOne(state, { id: 'default', changes: { secretKey: null } as any });
    },

    signOut(state) {
      keyAdapter.removeOne(state, 'default');
    },
  },
});
