import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultKeyId, keySlice } from '../keys/key.slice';
import { isUndefined } from '@app/common/utils';
import { logger } from '@shared/logger';

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
      if (state.keys[defaultKeyId]) {
        logger.warn('Not generating another wallet, already exists.');
        return;
      }
      state.keys[defaultKeyId] = action.payload;
    },

    saveUsersSecretKeyToBeRestored(state, action: PayloadAction<string>) {
      if (!isUndefined(state.keys[defaultKeyId])) {
        throw new Error('Cannot restore key for pre-existing wallet');
      }
      state.keys[defaultKeyId] = action.payload;
    },

    setKeysInMemory(state, action: PayloadAction<Record<string, string>>) {
      return { ...state, hasRestoredKeys: true, keys: { ...state.keys, ...action.payload } };
    },

    lockWallet(state) {
      state.keys = {};
    },
  },
  extraReducers: {
    [keySlice.actions.signOut.toString()](state) {
      state.keys = {};
    },
  },
});
