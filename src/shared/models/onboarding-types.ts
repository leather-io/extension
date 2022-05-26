export enum OnboardingSteps {
  BackUpSecretKey = 'Back up secret key',
  AddFunds = 'Add funds',
  ExploreApps = 'Explore apps',
  BuyNft = 'Buy an NFT',
}

export enum OnboardingStepStatus {
  Start,
  Done,
}

export const enum RouteType {
  Internal,
  External,
}

export interface OnboardingStepsStatus {
  [OnboardingSteps.BackUpSecretKey]: OnboardingStepStatus;
  [OnboardingSteps.AddFunds]: OnboardingStepStatus;
  [OnboardingSteps.BuyNft]: OnboardingStepStatus;
  [OnboardingSteps.ExploreApps]: OnboardingStepStatus;
}
