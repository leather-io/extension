import {
  shouldNavigateBackToBackupSecretKeyPage,
  shouldNavigateToOnboardingStartPage,
  shouldNavigateToUnlockWalletPage,
} from './account-gate';

describe(shouldNavigateBackToBackupSecretKeyPage.name, () => {
  test('that it navigates to backup page when no wallet yet created, but key generated', () => {
    const result = shouldNavigateBackToBackupSecretKeyPage(undefined, 'some-encrypted-key');
    expect(result).toBeTruthy();
  });

  test('that it does not navigate to backup page when no wallet yet created, but key generated', () => {
    const result = shouldNavigateBackToBackupSecretKeyPage(undefined, null);
    expect(result).toBeFalsy();
  });
});

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
