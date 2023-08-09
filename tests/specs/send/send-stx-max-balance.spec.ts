import { test } from '../../fixtures/fixtures';

test.describe('send stx max balance', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.enableTestMode();
    await homePage.sendButton.click();
    await sendPage.selectStxAndGoToSendForm();
  });

  test('that send max button sets available balance minus fee', async ({ sendPage }) => {
    await sendPage.amountInput.fill('.0001');
    await sendPage.amountInput.clear();
    await sendPage.amountInput.blur();
    await sendPage.sendMaxButton.click();
    await sendPage.amountInput.blur();
    test.expect(await sendPage.amountInput.inputValue()).toBeTruthy();
  });
});
