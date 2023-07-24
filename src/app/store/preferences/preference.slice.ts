import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface PreferenceState {
  preference: {
    [key: string]: {
      saveRateForFuture: boolean;
      savedRate: string;
    };
  };
}

const getInitialState = (): PreferenceState => {
  const defaultState: PreferenceState = {
    preference: {},
  };

  chrome.storage.local.get(null, result => {
    return {
      preference: result || {},
    };
  });

  return defaultState;
};

const initialState = getInitialState();

export const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    setPreference: (state, action: PayloadAction<{ key: string; value: any }>) => {
      const { key, value } = action.payload;
      state.preference[key] = value;
    },
    removePreference: (state, action: PayloadAction<string>) => {
      const keyToRemove = action.payload;
      delete state.preference[keyToRemove];
    },
  },
});
