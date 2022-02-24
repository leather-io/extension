import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { migrateVaultReducerStoreToNewStateStructure } from '../utils/vault-reducer-migration';

export const defaultKeyId = 'default' as const;

interface KeyConfigSoftware {
  type: 'software';
  id: string;
  encryptedSecretKey: string;
  salt: string;
}

const keyAdapter = createEntityAdapter<KeyConfigSoftware>();

export const initialKeysState = keyAdapter.getInitialState();

export const keySlice = createSlice({
  name: 'keys',
  initialState: migrateVaultReducerStoreToNewStateStructure(initialKeysState),
  reducers: {
    createNewWalletComplete(state, action: PayloadAction<KeyConfigSoftware>) {
      keyAdapter.addOne(state, action.payload);
    },

    signOut(state) {
      keyAdapter.removeOne(state, defaultKeyId);
    },
  },
});
