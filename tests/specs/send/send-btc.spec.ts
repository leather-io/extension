import { TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS } from '@tests/mocks/constants';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { getDisplayerAddress } from '@tests/utils';

import { FormErrorMessages } from '@app/common/error-messages';

import { test } from '../../fixtures/fixtures';

test.describe('send btc', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInExistingUser();
    await homePage.enableTestMode();
    await homePage.sendButton.click();
    await sendPage.selectBtcAndGoToSendForm();
  });

  test.describe('btc send form', () => {
    test('that it shows preview of tx details to be confirmed', async ({ sendPage }) => {
      await sendPage.amountInput.fill('0.0001');
      await sendPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS);
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

    test('that asset value and recipient on preview match input', async ({ sendPage }) => {
      const amount = '0.00006';
      const amountSymbol = 'BTC';

      await sendPage.amountInput.fill(amount);
      await sendPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS);
      await sendPage.recipientInput.blur();
      await sendPage.page.waitForTimeout(1000);

      await sendPage.previewSendTxButton.click();

      const displayerAddress = await getDisplayerAddress(sendPage.confirmationDetailsRecipient);
      test.expect(displayerAddress).toEqual(TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS);

      const confirmationAssetValue = await sendPage.confirmationDetails
        .getByTestId(SharedComponentsSelectors.InfoCardAssetValue)
        .innerText();
      test.expect(confirmationAssetValue).toEqual(`${amount} ${amountSymbol}`);
    });
  });
});
