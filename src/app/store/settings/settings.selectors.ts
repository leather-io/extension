import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { RootState, useAppDispatch } from '@app/store';

import { settingsSlice } from './settings.slice';

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

const selectDismissedMessageIds = createSelector(
  selectSettings,
  state => state.dismissedMessages ?? []
);

export function useDismissedMessageIds() {
  return useSelector(selectDismissedMessageIds);
}

const selectHasApprovedNewBrand = createSelector(
  selectSettings,
  state => !!state.hasApprovedNewBrand
);

export function useNewBrandApprover() {
  const hasApprovedNewBrand = useSelector(selectHasApprovedNewBrand);
  const dispatch = useAppDispatch();
  return {
    hasApprovedNewBrand,
    userApprovedNewBrand() {
      dispatch(settingsSlice.actions.setHasApprovedNewBrand());
    },
  };
}
