import { test } from '../../fixtures/fixtures';

test.describe('swap', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, swapPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.enableTestMode();
    await homePage.swapButton.click();
    await swapPage.waitForSendPageReady();
  });

  // Skip tests until feature is live
  test.skip('that it shows swap page', async ({ swapPage }) => {
    await test.expect(swapPage.page.getByText('Swap')).toBeVisible();
  });
});
