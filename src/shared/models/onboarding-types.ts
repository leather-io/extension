export enum SuggestedFirstSteps {
  BackUpSecretKey = 'Back up secret key',
  AddFunds = 'Add some funds',
  ExploreApps = 'Explore apps',
  BuyNft = 'Buy an NFT',
}

export enum SuggestedFirstStepStatus {
  Incomplete,
  Complete,
}

export interface SuggestedFirstStepsStatus {
  [SuggestedFirstSteps.BackUpSecretKey]: SuggestedFirstStepStatus;
  [SuggestedFirstSteps.AddFunds]: SuggestedFirstStepStatus;
  [SuggestedFirstSteps.BuyNft]: SuggestedFirstStepStatus;
  [SuggestedFirstSteps.ExploreApps]: SuggestedFirstStepStatus;
}
