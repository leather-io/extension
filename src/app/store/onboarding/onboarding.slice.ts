import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  SuggestedFirstStepStatus,
  SuggestedFirstSteps,
  SuggestedFirstStepsStatus,
} from '@shared/models/onboarding-types';

interface OnboardingState {
  hideSteps: boolean;
  stepsStatus: SuggestedFirstStepsStatus;
}

const initialState: OnboardingState = {
  hideSteps: false,
  stepsStatus: {
    [SuggestedFirstSteps.BackUpSecretKey]: SuggestedFirstStepStatus.Complete,
    [SuggestedFirstSteps.AddFunds]: SuggestedFirstStepStatus.Incomplete,
    [SuggestedFirstSteps.ExploreApps]: SuggestedFirstStepStatus.Incomplete,
    [SuggestedFirstSteps.BuyNft]: SuggestedFirstStepStatus.Incomplete,
  },
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    hideSuggestedFirstSteps(state, action: PayloadAction<boolean>) {
      state.hideSteps = action.payload;
    },
    userCompletedSuggestedFirstStep(state, action: PayloadAction<{ step: SuggestedFirstSteps }>) {
      state.stepsStatus[action.payload.step] = SuggestedFirstStepStatus.Complete;
    },
  },
});
