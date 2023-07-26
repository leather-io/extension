import { useDispatch } from 'react-redux';

import { Dispatch } from '@reduxjs/toolkit';

import { settingsSlice } from './settings.slice';

interface Values {
  saveRateForFuture: boolean;
  savedRate: string;
}

export const settingsActions = settingsSlice.actions;

export function useDismissMessage() {
  const dispatch = useDispatch();
  return (messageId: string) => dispatch(settingsActions.messageDismissed(messageId));
}

export const savePreferenceToStorage = (key: string, value: Values): any => {
  return (dispatch: Dispatch) => dispatch(settingsActions.setPreference({ key, value }));
};

export const removePreferenceFromStorage = (key: string): any => {
  return (dispatch: Dispatch) => dispatch(settingsActions.removePreference(key));
};
