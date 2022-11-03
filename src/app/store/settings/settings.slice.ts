import { UserSelectedTheme } from '@app/common/theme-provider';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
  userSelectedTheme: UserSelectedTheme;
}

const initialState: InitialState = {
  userSelectedTheme: 'system',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUserSelectedTheme(state, action: PayloadAction<UserSelectedTheme>) {
      state.userSelectedTheme = action.payload;
    },
  },
});
