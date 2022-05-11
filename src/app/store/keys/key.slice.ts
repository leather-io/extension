import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { migrateVaultReducerStoreToNewStateStructure } from '../utils/vault-reducer-migration';
import { StxAndIdentityPublicKeys } from '@app/features/ledger/ledger-utils';

export const defaultKeyId = 'default' as const;

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
    createNewSoftwareWalletComplete(state, action: PayloadAction<KeyConfigSoftware>) {
      keyAdapter.addOne(state, action.payload);
    },

    signOut(state) {
      keyAdapter.removeOne(state, defaultKeyId);
    },

    createLedgerWallet(state, action: PayloadAction<KeyConfigLedger>) {
      keyAdapter.addOne(state, action.payload);
    },
  },
});
