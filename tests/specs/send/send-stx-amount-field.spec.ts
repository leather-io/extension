import { FormErrorMessages } from '@app/common/error-messages';

import { test } from '../../fixtures/fixtures';

test.describe('send stx amount field', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.enableTestMode();
    await homePage.sendButton.click();
    await sendPage.selectStxAndGoToSendForm();
  });

  test('that the amount must be a number', async ({ sendPage }) => {
    await sendPage.amountInput.fill('aaaaaa');
    await sendPage.amountInput.blur();
    const errorMsg = await sendPage.amountInputErrorLabel.innerText();
    test.expect(errorMsg).toBeTruthy();
  });

  test('that the amount must be positive', async ({ sendPage }) => {
    await sendPage.amountInput.fill('-9999');
    await sendPage.amountInput.blur();
    const errorMsg = await sendPage.amountInputErrorLabel.innerText();
    test.expect(errorMsg).toEqual(FormErrorMessages.MustBePositive);
  });

  test('that the amount field enforces max length based on decimals', async ({ sendPage }) => {
    await sendPage.amountInput.fill('0.0000001');
    await sendPage.amountInput.blur();
    const errorMsg = await sendPage.amountInputErrorLabel.innerText();
    test.expect(errorMsg).toEqual(FormErrorMessages.MustBePositive);
  });

  test('that the amount is greater than the available balance', async ({ sendPage }) => {
    await sendPage.amountInput.fill('999999999');
    await sendPage.amountInput.blur();
    const errorMsg = await sendPage.amountInputErrorLabel.innerText();
    test.expect(errorMsg).toContain('Insufficient balance');
  });
});
