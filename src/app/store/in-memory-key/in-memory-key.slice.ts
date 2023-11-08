import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { logger } from '@shared/logger';
import { defaultWalletKeyId } from '@shared/utils';

import { keySlice } from '../software-keys/software-key.slice';

interface InMemoryKeyState {
  hasRestoredKeys: boolean;
  keys: Record<string, string | undefined>;
}

const initialState: InMemoryKeyState = {
  hasRestoredKeys: false,
  keys: {},
};

export const inMemoryKeySlice = createSlice({
  name: 'inMemoryKey',
  initialState,

  reducers: {
    generateWalletKey(state, action: PayloadAction<string>) {
      if (state.keys[defaultWalletKeyId]) {
        logger.warn('Not generating another wallet, already exists.');
        return;
      }
      state.keys[defaultWalletKeyId] = action.payload;
    },

    saveUsersSecretKeyToBeRestored(state, action: PayloadAction<string>) {
      state.keys[defaultWalletKeyId] = action.payload;
    },

    setKeysInMemory(state, action: PayloadAction<Record<string, string>>) {
      return { ...state, hasRestoredKeys: true, keys: { ...state.keys, ...action.payload } };
    },

    lockWallet(state) {
      state.keys = {};
    },
  },

  extraReducers: builder => {
    builder.addCase(keySlice.actions.signOut.toString(), state => {
      state.keys = {};
    });
  },
});
