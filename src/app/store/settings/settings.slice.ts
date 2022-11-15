import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { UserSelectedTheme } from '@app/common/theme-provider';

type HasAcceptedAnalytics = null | boolean;
interface InitialState {
  userSelectedTheme: UserSelectedTheme;
  hasAllowedAnalytics: HasAcceptedAnalytics;
}

const initialState: InitialState = {
  userSelectedTheme: 'system',
  hasAllowedAnalytics: null,
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
  },
});
