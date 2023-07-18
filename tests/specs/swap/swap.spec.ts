import { test } from '../../fixtures/fixtures';

test.describe('swap', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, swapPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.enableTestMode();
    await homePage.swapButton.click();
    await swapPage.waitForSendPageReady();
  });

  test.describe('swap', () => {
    test('that it shows swap page', async ({ sendPage }) => {
      await test.expect(sendPage.page.getByText('Coming soon!')).toBeVisible();
    });
  })
})
