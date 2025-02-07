import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { defaultWalletKeyId } from '@shared/utils';

import { migrateVaultReducerStoreToNewStateStructure } from '../utils/vault-reducer-migration';

interface KeyConfig {
  type: 'software';
  id: 'default';
  encryptedSecretKey: string;
  salt: string;
}
const keyAdapter = createEntityAdapter<KeyConfig>();

export const initialKeysState = keyAdapter.getInitialState();

export const keySlice = createSlice({
  name: 'softwareKeys',
  initialState: migrateVaultReducerStoreToNewStateStructure(initialKeysState),
  reducers: {
    createSoftwareWalletComplete(state, action: PayloadAction<KeyConfig>) {
      keyAdapter.upsertOne(state as any, action.payload);
    },

    signOut(state) {
      keyAdapter.removeOne(state as any, defaultWalletKeyId);
    },

    debugKillStacks() {
      // if (state.entities.default?.type !== 'ledger') return;
      // state.entities.default.publicKeys = [];
    },
  },
});
