import { TEST_ACCOUNT_2_BTC_ADDRESS } from '@tests/mocks/constants';

import { FormErrorMessages } from '@app/common/error-messages';

import { test } from '../../fixtures/fixtures';

test.describe('send btc', () => {
  // TODO: Don't run these if we disable bitcoin sending?
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInExistingUser();

    await homePage.sendButton.click();
    await sendPage.selectBtcAndGoToSendForm();
  });

  test.describe('btc send form', () => {
    test('that it shows preview of tx details to be confirmed', async ({ sendPage }) => {
      await sendPage.amountInput.fill('0.0001');
      await sendPage.recipientInput.fill(TEST_ACCOUNT_2_BTC_ADDRESS);
      await sendPage.previewSendTxButton.click();
      const details = await sendPage.confirmationDetails.allInnerTexts();
      test.expect(details).toBeTruthy();
    });

    test('that it shows preview of tx details after validation error is resolved', async ({
      sendPage,
    }) => {
      await sendPage.amountInput.fill('0.00006');
      await sendPage.amountInput.blur();
      const errorMsg = await sendPage.amountInputErrorLabel.innerText();
      test.expect(errorMsg).toEqual(FormErrorMessages.InsufficientFunds);

      await sendPage.amountInput.fill('0.0001');
      await sendPage.previewSendTxButton.click();
      const details = await sendPage.confirmationDetails.allInnerTexts();
      test.expect(details).toBeTruthy();
    });
  });
});
