import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { defaultWalletKeyId } from '@shared/utils';

import { keySlice } from '../software-keys/software-key.slice';

interface StxChainKeyState {
  highestAccountIndex: number;
  currentAccountIndex: number;
}

const initialState: Record<string, StxChainKeyState> = {
  [defaultWalletKeyId]: {
    highestAccountIndex: 0,
    currentAccountIndex: 0,
  },
};

export const stxChainSlice = createSlice({
  name: 'stxChain',
  initialState,

  reducers: {
    switchAccount(state, action: PayloadAction<number>) {
      state.default.currentAccountIndex = action.payload;
    },
    createNewAccount(state) {
      state.default.highestAccountIndex += 1;
      state.default.currentAccountIndex = state.default.highestAccountIndex;
    },
    restoreAccountIndex(state, action: PayloadAction<number>) {
      state.default.highestAccountIndex = action.payload;
    },
  },

  extraReducers: builder => {
    builder.addCase(keySlice.actions.signOut.toString(), state => {
      state.default.highestAccountIndex = 0;
      state.default.currentAccountIndex = 0;
    });
  },
});
