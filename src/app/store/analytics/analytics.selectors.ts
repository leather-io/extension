import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app/store';

const selectAnalytics = (state: RootState) => state.analytics;

const selectHasStxDeposits = createSelector(selectAnalytics, state => state.hasStxDeposits);

export function useAnalyticsHasStxDeposits() {
  return useSelector(selectHasStxDeposits);
}
