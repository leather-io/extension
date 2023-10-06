import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { defaultWalletKeyId } from '@shared/utils';

import { StxAndIdentityPublicKeys } from '@app/features/ledger/utils/stacks-ledger-utils';

import { migrateVaultReducerStoreToNewStateStructure } from '../utils/vault-reducer-migration';

interface KeyConfigSoftware {
  type: 'software';
  id: string;
  encryptedSecretKey: string;
  salt: string;
}

interface KeyConfigLedger {
  type: 'ledger';
  id: string;
  publicKeys: StxAndIdentityPublicKeys[];
  targetId: string;
}

type KeyConfig = KeyConfigSoftware | KeyConfigLedger;
const keyAdapter = createEntityAdapter<KeyConfig>();

export const initialKeysState = keyAdapter.getInitialState();

export const keySlice = createSlice({
  name: 'keys',
  initialState: migrateVaultReducerStoreToNewStateStructure(initialKeysState),
  reducers: {
    createStacksSoftwareWalletComplete(state, action: PayloadAction<KeyConfigSoftware>) {
      keyAdapter.addOne(state, action.payload);
    },

    createNewStacksLedgerWallet(state, action: PayloadAction<KeyConfigLedger>) {
      keyAdapter.addOne(state, action.payload);
    },

    signOut(state) {
      keyAdapter.removeOne(state, defaultWalletKeyId);
    },

    debugKillStacks(state) {
      if (state.entities.default?.type !== 'ledger') return;
      state.entities.default.publicKeys = [];
    },
  },
});
