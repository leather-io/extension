export enum SuggestedFirstSteps {
  BackUpSecretKey = 'back_up_secret_key',
  AddFunds = 'add_funds',
  ExploreApps = 'explore_apps',
  BuyNft = 'buy_nft',
}

export enum SuggestedFirstStepStatus {
  Start,
  Done,
}

export interface SuggestedFirstStepsStatus {
  [SuggestedFirstSteps.BackUpSecretKey]: SuggestedFirstStepStatus;
  [SuggestedFirstSteps.AddFunds]: SuggestedFirstStepStatus;
  [SuggestedFirstSteps.BuyNft]: SuggestedFirstStepStatus;
  [SuggestedFirstSteps.ExploreApps]: SuggestedFirstStepStatus;
}
