import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { keySlice } from '../keys/key.slice';

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
    setKeysInMemory(state, action: PayloadAction<Record<string, string>>) {
      return { hasRestoredKeys: true, keys: { ...state.keys, ...action.payload } };
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
