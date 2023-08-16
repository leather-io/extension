import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { UserSelectedTheme } from '@app/common/theme-provider';

type HasAcceptedAnalytics = null | boolean;
interface InitialState {
  userSelectedTheme: UserSelectedTheme;
  hasAllowedAnalytics: HasAcceptedAnalytics;
  dismissedMessages: string[];
  hasApprovedNewBrand: boolean;
}

const initialState: InitialState = {
  userSelectedTheme: 'system',
  hasAllowedAnalytics: null,
  dismissedMessages: [],
  // Defaults to true, as this is undefined for existing users
  hasApprovedNewBrand: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUserSelectedTheme(state, action: PayloadAction<UserSelectedTheme>) {
      state.userSelectedTheme = action.payload;
    },
    setHasAllowedAnalytics(state, action: PayloadAction<boolean>) {
      state.hasAllowedAnalytics = action.payload;
    },
    messageDismissed(state, action: PayloadAction<string>) {
      if (!Array.isArray(state.dismissedMessages)) state.dismissedMessages = [];
      state.dismissedMessages = [...state.dismissedMessages, action.payload];
    },
    resetMessages(state) {
      state.dismissedMessages = [];
    },
    setHasApprovedNewBrand(state) {
      state.hasApprovedNewBrand = true;
    },
    resetHasApprovedNewBrand(state) {
      state.hasApprovedNewBrand = false;
    },
  },
});
