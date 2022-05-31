import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  SuggestedFirstSteps,
  SuggestedFirstStepsStatus,
  SuggestedFirstStepStatus,
} from '@shared/models/onboarding-types';

interface OnboardingState {
  hasHiddenSuggestedFirstSteps: boolean;
  hasSkippedFundAccount: boolean;
  suggestedFirstStepsStatus: SuggestedFirstStepsStatus;
}

const initialState: OnboardingState = {
  hasHiddenSuggestedFirstSteps: false,
  hasSkippedFundAccount: false,
  suggestedFirstStepsStatus: {
    [SuggestedFirstSteps.BackUpSecretKey]: SuggestedFirstStepStatus.Done,
    [SuggestedFirstSteps.AddFunds]: SuggestedFirstStepStatus.Start,
    [SuggestedFirstSteps.ExploreApps]: SuggestedFirstStepStatus.Start,
    [SuggestedFirstSteps.BuyNft]: SuggestedFirstStepStatus.Start,
  },
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    hideSuggestedFirstSteps(state, action: PayloadAction<boolean>) {
      state.hasHiddenSuggestedFirstSteps = action.payload;
    },
    skipFundAccount(state, action: PayloadAction<boolean>) {
      state.hasSkippedFundAccount = action.payload;
    },
    updateSuggestedFirstStepsStatus(state, action: PayloadAction<SuggestedFirstStepsStatus>) {
      state.suggestedFirstStepsStatus = action.payload;
    },
  },
});
