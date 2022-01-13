import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { RootState } from '@app/store';

const selectOnboarding = (state: RootState) => state.onboarding;

const selectHideSteps = createSelector(selectOnboarding, state => state.hideSteps);
const selectStepsStatus = createSelector(selectOnboarding, state => state.stepsStatus);

export function useHideSteps() {
  return useSelector(selectHideSteps);
}

export function useStepsStatus() {
  return useSelector(selectStepsStatus);
}
