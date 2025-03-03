import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { defaultWalletKeyId } from '@shared/utils';

import { keySlice } from '../software-keys/software-key.slice';

interface StxChainKeyState {
  highestAccountIndex: number;
  currentAccountIndex: number;
  currentAccountStacksDescriptor: string;
}

const initialState: Record<string, StxChainKeyState> = {
  [defaultWalletKeyId]: {
    highestAccountIndex: 0,
    currentAccountIndex: 0,
    currentAccountStacksDescriptor: '',
  },
};

export const stxChainSlice = createSlice({
  name: 'stxChain',
  initialState,

  reducers: {
    initializeAccount(state, action: PayloadAction<StxChainKeyState>) {
      state.default.highestAccountIndex = action.payload.highestAccountIndex;
      state.default.currentAccountIndex = action.payload.currentAccountIndex;
      state.default.currentAccountStacksDescriptor = action.payload.currentAccountStacksDescriptor;
    },
    switchAccount(
      state,
      action: PayloadAction<{ accountIndex: number; stacksDescriptor?: string }>
    ) {
      state.default.currentAccountIndex = action.payload.accountIndex;
      if (action.payload.stacksDescriptor)
        state.default.currentAccountStacksDescriptor = action.payload.stacksDescriptor;
    },
    createNewAccount(state, action: PayloadAction<string>) {
      state.default.highestAccountIndex += 1;
      state.default.currentAccountIndex = state.default.highestAccountIndex;
      state.default.currentAccountStacksDescriptor = action.payload;
    },
    restoreAccountIndex(state, action: PayloadAction<number>) {
      state.default.highestAccountIndex = action.payload;
    },
  },

  extraReducers: builder => {
    builder.addCase(keySlice.actions.signOut.toString(), state => {
      state.default.highestAccountIndex = 0;
      state.default.currentAccountIndex = 0;
      state.default.currentAccountStacksDescriptor = '';
    });
  },
});
