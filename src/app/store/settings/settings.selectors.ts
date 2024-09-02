import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app/store';

const selectSettings = (state: RootState) => state.settings;

const selectUserSelectedTheme = createSelector(selectSettings, state => state.userSelectedTheme);

export function useUserSelectedTheme() {
  return useSelector(selectUserSelectedTheme);
}

const selectDismissedMessageIds = createSelector(
  selectSettings,
  state => state.dismissedMessages ?? []
);

export function useDismissedMessageIds() {
  return useSelector(selectDismissedMessageIds);
}

const selectIsPrivateMode = createSelector(selectSettings, state => state.isPrivateMode ?? false);

export function useIsPrivateMode() {
  return useSelector(selectIsPrivateMode);
}
