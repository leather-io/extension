import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app/store';

const selectSettings = (state: RootState) => state.settings;

const selectUserSelectedTheme = createSelector(selectSettings, state => state.userSelectedTheme);
export function useUserSelectedTheme() {
  return useSelector(selectUserSelectedTheme);
}

const selectHasUserExplicitlyDeclinedAnalytics = createSelector(
  selectSettings,
  state => state.hasAllowedAnalytics === false
);
export function useHasUserExplicitlyDeclinedAnalytics() {
  return useSelector(selectHasUserExplicitlyDeclinedAnalytics);
}
const selectHasUserRespondedToAnalyticsConsent = createSelector(
  selectSettings,
  state => state.hasAllowedAnalytics !== null
);
export function useHasUserRespondedToAnalyticsConsent() {
  return useSelector(selectHasUserRespondedToAnalyticsConsent);
}
