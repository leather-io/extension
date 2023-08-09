import { TEST_TESTNET_ACCCOUNT_2_STX_ADDRESS } from '@tests/mocks/constants';

import { FormErrorMessages } from '@app/common/error-messages';

import { test } from '../../fixtures/fixtures';

test.describe('send stx recipient field validation', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.enableTestMode();
    await homePage.sendButton.click();
    await sendPage.selectStxAndGoToSendForm();
  });

  test('that valid addresses are accepted', async ({ sendPage }) => {
    await sendPage.amountInput.fill('0.000001');
    await sendPage.recipientInput.fill(TEST_TESTNET_ACCCOUNT_2_STX_ADDRESS);
    await sendPage.previewSendTxButton.click();
    const details = await sendPage.confirmationDetails.allInnerTexts();
    test.expect(details).toBeTruthy();
  });

  test('that the address must be valid', async ({ sendPage }) => {
    await sendPage.recipientInput.fill('ST3TZVWsss4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
    await sendPage.recipientInput.blur();
    const errorMsg = await sendPage.formInputErrorLabel.innerText();
    test.expect(errorMsg).toContain(FormErrorMessages.InvalidAddress);
  });

  test('that the address cannot be same as sender', async ({ page, sendPage }) => {
    await sendPage.recipientChooseAccountButton.click();
    await page.getByTestId('switch-account-item-0').click();
    await sendPage.previewSendTxButton.click();
    const errorMsg = await sendPage.formInputErrorLabel.innerText();
    test.expect(errorMsg).toContain(FormErrorMessages.SameAddress);
  });
});
