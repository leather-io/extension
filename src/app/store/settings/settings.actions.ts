import { useDispatch } from 'react-redux';

import { Dispatch } from '@reduxjs/toolkit';

import { settingsSlice } from './settings.slice';

interface savedFeeValueDetails {
  saveRateForFuture: boolean;
  savedRate: string;
}

export const settingsActions = settingsSlice.actions;

export function useDismissMessage() {
  const dispatch = useDispatch();
  return (messageId: string) => dispatch(settingsActions.messageDismissed(messageId));
}

export const saveFeeValueToStorage = (key: string, value: savedFeeValueDetails): any => {
  return (dispatch: Dispatch) => dispatch(settingsActions.setFeeValue({ key, value }));
};

export const removeFeeValueFromStorage = (key: string): any => {
  return (dispatch: Dispatch) => dispatch(settingsActions.removeFeeValue(key));
};
