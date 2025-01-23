import { TEST_PASSWORD } from '@tests/mocks/constants';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { WalletDefaultNetworkConfigurationIds } from '@leather.io/models';

import { test } from '../../fixtures/fixtures';

test.describe('Settings menu', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
  });

  test('that menu item takes user to support page', async ({ page }) => {
    await page.getByTestId(SettingsSelectors.SettingsMenuBtn).click();

    const [supportPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId(SettingsSelectors.GetSupportMenuItem).click(),
    ]);

    await test.expect(supportPage).toHaveURL('https://leather.io/contact');
  });

  test('that menu item can perform sign out', async ({ homePage, onboardingPage }) => {
    await homePage.signOut();
    const button = onboardingPage.page.getByTestId(OnboardingSelectors.SignUpBtn);
    test.expect(button).toBeTruthy();
  });

  test('that menu item can lock and unlock the extension', async ({ homePage, page }) => {
    await homePage.lock();

    await page.getByTestId(SettingsSelectors.EnterPasswordInput).fill(TEST_PASSWORD);
    await page.getByTestId(SettingsSelectors.UnlockWalletBtn).click();

    const displayName = await page
      .getByTestId(SettingsSelectors.CurrentAccountDisplayName)
      .innerText();

    test.expect(displayName).toEqual('Account 1');
  });

  // TODO 3919 improve tests = This doesn't actually test copy of the value
  test('that menu item allows viewing and saving secret key to clipboard', async ({
    page,
    homePage,
  }) => {
    await homePage.goToSecretKey();
    await page.getByTestId(SettingsSelectors.EnterPasswordInput).fill(TEST_PASSWORD);
    await page.getByTestId(SettingsSelectors.UnlockWalletBtn).click();
    await page.getByTestId(SettingsSelectors.CopyKeyToClipboardBtn).click();

    const copySuccessMessage = await page
      .getByTestId(SettingsSelectors.CopyKeyToClipboardBtn)
      .innerText();

    test.expect(copySuccessMessage).toContain('Copied!');
  });

  // TODO 3919 improve tests - this doesn't actually change networks
  test('that menu item allows changing networks', async ({ homePage, page }) => {
    await homePage.clickSettingsButton();
    const currentNetwork = await page.getByTestId(SettingsSelectors.CurrentNetwork).innerText();
    test.expect(currentNetwork).toContain('mainnet');

    await page.getByTestId(SettingsSelectors.ChangeNetworkAction).click();
    await page.waitForTimeout(1000);
    const networkListItems = await page.getByTestId(SettingsSelectors.NetworkListItem).all();
    test
      .expect(networkListItems)
      .toHaveLength(Object.keys(WalletDefaultNetworkConfigurationIds).length);
  });

  test('that menu item can toggle privacy', async ({ page, homePage }) => {
    const visibleBalanceText = await homePage.page
      .getByTestId(SharedComponentsSelectors.AccountCardBalanceText)
      .textContent();
    test.expect(visibleBalanceText).toBeTruthy();

    await homePage.clickSettingsButton();
    await page.getByTestId(SettingsSelectors.TogglePrivacy).click();

    // just checks that the balance text changed (don't care about the implementation)
    await test
      .expect(homePage.page.getByTestId(SharedComponentsSelectors.AccountCardBalanceText))
      .not.toHaveText(visibleBalanceText!);

    await homePage.clickSettingsButton();
    await page.getByTestId(SettingsSelectors.TogglePrivacy).click();

    await test
      .expect(homePage.page.getByTestId(SharedComponentsSelectors.AccountCardBalanceText))
      .not.toContainText('***');
  });
});
