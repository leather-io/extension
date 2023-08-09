import { TEST_TESTNET_ACCCOUNT_2_STX_ADDRESS } from '@tests/mocks/constants';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { getDisplayerAddress } from '@tests/utils';

import { FormErrorMessages } from '@app/common/error-messages';

import { test } from '../../fixtures/fixtures';

test.describe('send stx preview', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.enableTestMode();
    await homePage.sendButton.click();
    await sendPage.selectStxAndGoToSendForm();
  });

  test('that it shows preview of tx details to be confirmed', async ({ page, sendPage }) => {
    await sendPage.amountInput.fill('0.000001');
    await sendPage.recipientInput.fill(TEST_TESTNET_ACCCOUNT_2_STX_ADDRESS);
    await page.getByTestId(SharedComponentsSelectors.FeeToBePaidLabel).scrollIntoViewIfNeeded();
    await sendPage.previewSendTxButton.click();
    const details = await sendPage.confirmationDetails.allInnerTexts();
    test.expect(details).toBeTruthy();
  });

  test('that it shows preview of tx details after validation error is resolved', async ({
    sendPage,
  }) => {
    await sendPage.amountInput.fill('0.0000001');
    await sendPage.recipientInput.fill(TEST_TESTNET_ACCCOUNT_2_STX_ADDRESS);
    await sendPage.previewSendTxButton.click();
    const errorMsg = await sendPage.amountInputErrorLabel.innerText();
    test.expect(errorMsg).toEqual(FormErrorMessages.MustBePositive);

    await sendPage.amountInput.fill('0.000001');
    await sendPage.previewSendTxButton.click();
    const details = await sendPage.confirmationDetails.allInnerTexts();
    test.expect(details).toBeTruthy();
  });

  test('that asset value, recipient, memo and fees on preview match input', async ({
    sendPage,
  }) => {
    const amount = '0.000001';
    const amountSymbol = 'STX';
    const memo = '123';
    await sendPage.amountInput.fill(amount);
    await sendPage.recipientInput.fill(TEST_TESTNET_ACCCOUNT_2_STX_ADDRESS);
    await sendPage.memoInput.fill(memo);
    const fees = await sendPage.page
      .getByTestId(SharedComponentsSelectors.FeeToBePaidLabel)
      .innerText();
    await sendPage.previewSendTxButton.click();

    const displayerAddress = await getDisplayerAddress(sendPage.confirmationDetailsRecipient);

    test.expect(displayerAddress).toEqual(TEST_TESTNET_ACCCOUNT_2_STX_ADDRESS);

    const confirmationAssetValue = await sendPage.confirmationDetails
      .getByTestId(SharedComponentsSelectors.InfoCardAssetValue)
      .innerText();
    test.expect(confirmationAssetValue).toEqual(`${amount} ${amountSymbol}`);

    const confirmationFees = await sendPage.feesRow
      .getByTestId(SharedComponentsSelectors.InfoCardRowValue)
      .innerText();
    test.expect(confirmationFees).toEqual(fees);

    const confirmationMemo = await sendPage.memoRow
      .getByTestId(SharedComponentsSelectors.InfoCardRowValue)
      .innerText();
    test.expect(confirmationMemo).toEqual(memo);
  });

  test('that empty memo on preview matches default empty value', async ({ sendPage }) => {
    const amount = '0.000001';
    const emptyMemoPreviewValue = 'No memo';

    await sendPage.amountInput.fill(amount);
    await sendPage.recipientInput.fill(TEST_TESTNET_ACCCOUNT_2_STX_ADDRESS);
    await sendPage.previewSendTxButton.click();

    const confirmationMemo = await sendPage.memoRow
      .getByTestId(SharedComponentsSelectors.InfoCardRowValue)
      .innerText();
    test.expect(confirmationMemo).toEqual(emptyMemoPreviewValue);
  });
});
