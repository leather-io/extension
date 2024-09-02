import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { UserSelectedTheme } from '@app/common/theme-provider';

interface InitialState {
  userSelectedTheme: UserSelectedTheme;
  dismissedMessages: string[];
  isPrivateMode?: boolean;
}

const initialState: InitialState = {
  userSelectedTheme: 'system',
  dismissedMessages: [],
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUserSelectedTheme(state, action: PayloadAction<UserSelectedTheme>) {
      state.userSelectedTheme = action.payload;
    },
    messageDismissed(state, action: PayloadAction<string>) {
      if (!Array.isArray(state.dismissedMessages)) state.dismissedMessages = [];
      state.dismissedMessages = [...state.dismissedMessages, action.payload];
    },
    resetMessages(state) {
      state.dismissedMessages = [];
    },
    togglePrivateMode(state) {
      state.isPrivateMode = !state.isPrivateMode;
    },
  },
});
