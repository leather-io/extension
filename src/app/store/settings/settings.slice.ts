import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { UserSelectedTheme } from '@app/common/theme-provider';

interface InitialState {
  userSelectedTheme: UserSelectedTheme;
  dismissedMessages: string[];
  isPrivateMode?: boolean;
  isNotificationsEnabled?: boolean;
  bypassInscriptionChecks?: boolean;
  discardedInscriptions: string[];
}

const initialState: InitialState = {
  userSelectedTheme: 'system',
  dismissedMessages: [],
  discardedInscriptions: [],
  isNotificationsEnabled: true,
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
    toggleNotificationsEnabled(state) {
      state.isNotificationsEnabled = !state.isNotificationsEnabled;
    },
    dangerouslyChosenToBypassAllInscriptionChecks(state) {
      state.bypassInscriptionChecks = true;
    },
    discardInscription(state, action: PayloadAction<string>) {
      if (!Array.isArray(state.discardedInscriptions)) state.discardedInscriptions = [];
      state.discardedInscriptions.push(action.payload);
    },
    recoverInscription(state, action: PayloadAction<string>) {
      state.discardedInscriptions = state.discardedInscriptions.filter(
        inscriptionId => inscriptionId !== action.payload
      );
    },
    resetInscriptionState(state) {
      state.discardedInscriptions = [];
    },
  },
});
