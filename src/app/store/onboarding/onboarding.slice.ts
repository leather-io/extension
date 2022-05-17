import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  OnboardingSteps,
  OnboardingStepsStatus,
  OnboardingStepStatus,
} from '@shared/models/onboarding-types';

interface OnboardingState {
  hasHiddenSteps: boolean;
  hasSkippedFundAccount: boolean;
  stepsStatus: OnboardingStepsStatus;
}

const initialState: OnboardingState = {
  hasHiddenSteps: false,
  hasSkippedFundAccount: false,
  stepsStatus: {
    [OnboardingSteps.BackUpSecretKey]: OnboardingStepStatus.Done,
    [OnboardingSteps.AddFunds]: OnboardingStepStatus.Start,
    [OnboardingSteps.ExploreApps]: OnboardingStepStatus.Start,
    [OnboardingSteps.BuyNft]: OnboardingStepStatus.Start,
  },
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    hideSteps(state, action: PayloadAction<boolean>) {
      state.hasHiddenSteps = action.payload;
    },
    skipFundAccount(state, action: PayloadAction<boolean>) {
      state.hasSkippedFundAccount = action.payload;
    },
    updateStepsStatus(state, action: PayloadAction<OnboardingStepsStatus>) {
      state.stepsStatus = action.payload;
    },
  },
});
