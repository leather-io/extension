import { SettingsSelectors } from '@tests/selectors/settings.selectors';

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

    await test
      .expect(supportPage)
      .toHaveURL('https://leather.gitbook.io/guides/installing/contact-support');
  });
});
