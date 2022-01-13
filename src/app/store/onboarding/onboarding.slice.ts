import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  OnboardingSteps,
  OnboardingStepsStatus,
  OnboardingStepStatus,
} from '@shared/models/onboarding-types';

interface OnboardingState {
  hideSteps: boolean;
  stepsStatus: OnboardingStepsStatus;
}

const initialState: OnboardingState = {
  hideSteps: false,
  stepsStatus: {
    [OnboardingSteps.BackUpSecretKey]: OnboardingStepStatus.Done,
    [OnboardingSteps.AddFunds]: OnboardingStepStatus.Start,
    [OnboardingSteps.RegisterName]: OnboardingStepStatus.Start,
    [OnboardingSteps.ExploreApps]: OnboardingStepStatus.Start,
  },
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    hideSteps(state, action: PayloadAction<boolean>) {
      state.hideSteps = action.payload;
    },
    updateStepsStatus(state, action: PayloadAction<OnboardingStepsStatus>) {
      state.stepsStatus = action.payload;
    },
  },
});
