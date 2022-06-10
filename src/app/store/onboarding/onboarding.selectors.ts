import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { RootState } from '@app/store';

const selectOnboarding = (state: RootState) => state.onboarding;

const selectHideSuggestedFirstSteps = createSelector(selectOnboarding, state => state.hideSteps);

const selectSuggestedFirstStepsStatus = createSelector(
  selectOnboarding,
  state => state.stepsStatus
);

export function useHideSuggestedFirstSteps() {
  return useSelector(selectHideSuggestedFirstSteps);
}

export function useSuggestedFirstStepsStatus() {
  return useSelector(selectSuggestedFirstStepsStatus);
}
