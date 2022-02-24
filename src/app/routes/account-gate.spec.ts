import {
  shouldNavigateToOnboardingStartPage,
  shouldNavigateToUnlockWalletPage,
} from './account-gate';

describe(shouldNavigateToOnboardingStartPage.name, () => {
  test('that it navigates to onboarding when no key details set', () => {
    const result = shouldNavigateToOnboardingStartPage(undefined);
    expect(result).toBeTruthy();
  });
});

describe(shouldNavigateToUnlockWalletPage.name, () => {
  test('that it navigates to unlock page', () => {
    const result = shouldNavigateToOnboardingStartPage('in-memory-key');
    expect(result).toBeFalsy();
  });

  test('that it has key in memory so goes to home page', () => {
    const result = shouldNavigateToOnboardingStartPage(undefined);
    expect(result).toBeTruthy();
  });
});
