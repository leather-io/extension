import { TEST_PASSWORD } from '@tests/mocks/constants';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { test } from '../../fixtures/fixtures';

test.describe('Settings integration tests', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
  });

  test('should be able to view and save secret key to clipboard', async ({ page, homePage }) => {
    await homePage.goToSecretKey();
    await page.getByTestId(SettingsSelectors.EnterPasswordInput).fill(TEST_PASSWORD);
    await page.getByTestId(SettingsSelectors.UnlockWalletBtn).click();
    await page.getByTestId(SettingsSelectors.CopyKeyToClipboardBtn).click();

    const copySuccessMessage = await page
      .getByTestId(SettingsSelectors.CopyKeyToClipboardBtn)
      .innerText();

    test.expect(copySuccessMessage).toContain('Copied!');
  });

  test('should be able to sign out, lock and unlock the extension', async ({
    homePage,
    page,
    onboardingPage,
  }) => {
    await homePage.signOut();
    await onboardingPage.signInExistingUser();

    await homePage.lock();

    await page.getByTestId(SettingsSelectors.EnterPasswordInput).fill(TEST_PASSWORD);
    await page.getByTestId(SettingsSelectors.UnlockWalletBtn).click();

    const displayName = await page
      .getByTestId(SettingsSelectors.CurrentAccountDisplayName)
      .innerText();

    test.expect(displayName).toEqual('Account 1');
  });

  test('should be able to change network', async ({ homePage, page }) => {
    await homePage.clickSettingsButton();
    const currentNetwork = await page.getByTestId(SettingsSelectors.CurrentNetwork).innerText();
    test.expect(currentNetwork).toContain('mainnet');

    await page.getByTestId(SettingsSelectors.ChangeNetworkAction).click();
    await page.waitForTimeout(850);
    const networkListItems = await page.getByTestId(SettingsSelectors.NetworkListItem).all();
    test.expect(networkListItems).toHaveLength(4);
  });
});
