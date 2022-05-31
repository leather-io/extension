import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { RootState } from '@app/store';

const selectOnboarding = (state: RootState) => state.onboarding;

const selectHideSuggestedFirstSteps = createSelector(
  selectOnboarding,
  state => state.hasHiddenSuggestedFirstSteps
);

const selectSkipFundAccount = createSelector(
  selectOnboarding,
  state => state.hasSkippedFundAccount
);

const selectSuggestedFirstStepsStatus = createSelector(
  selectOnboarding,
  state => state.suggestedFirstStepsStatus
);

export function useHideSuggestedFirstSteps() {
  return useSelector(selectHideSuggestedFirstSteps);
}

export function useSkipFundAccount() {
  return useSelector(selectSkipFundAccount);
}

export function useSuggestedFirstStepsStatus() {
  return useSelector(selectSuggestedFirstStepsStatus);
}
