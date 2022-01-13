export enum OnboardingSteps {
  BackUpSecretKey = 'Back up secret key',
  AddFunds = 'Add some funds',
  RegisterName = 'Register a name',
  ExploreApps = 'Explore apps',
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
  [OnboardingSteps.RegisterName]: OnboardingStepStatus;
  [OnboardingSteps.ExploreApps]: OnboardingStepStatus;
}
