import { Dispatch } from '@reduxjs/toolkit';

import { preferenceSlice } from './preference.slice';

interface Values {
  saveRateForFuture: boolean;
  savedRate: string;
}

const { setPreference, removePreference } = preferenceSlice.actions;

export const savePreferenceToStorage = (key: string, value: Values): any => {
  return (dispatch: Dispatch) => {
    dispatch(setPreference({ key, value }));
    const data = { [key]: value };
    chrome.storage.local.set(data);
  };
};

export const removePreferenceFromStorage = (key: string): any => {
  return (dispatch: Dispatch) => {
    dispatch(removePreference(key));
    chrome.storage.local.remove(key);
  };
};

export const setInitialPreferenceData = (): any => {
  return (dispatch: Dispatch) => {
    chrome.storage.local.get(null, result => {
      Object.entries(result).forEach(([key, value]) => {
        dispatch(setPreference({ key, value }));
      });
    });
  };
};

export const preferenceActions = preferenceSlice.actions;
