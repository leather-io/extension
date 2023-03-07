import {
  TEST_ACCOUNT_2_STX_ADDRESS,
  TEST_BNS_NAME,
  TEST_BNS_RESOLVED_ADDRESS,
} from '@tests/mocks/constants';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { getDisplayerAddress } from '@tests/utils';

import { FormErrorMessages } from '@app/common/error-messages';

import { test } from '../../fixtures/fixtures';

test.describe('send stx', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInExistingUser();

    await homePage.sendButton.click();
    await sendPage.selectStxAndGoToSendForm();
  });

  test.describe('send form input fields', () => {
    test('that send max button sets available balance minus fee', async ({ sendPage }) => {
      await sendPage.amountInput.fill('.0001');
      await sendPage.amountInput.clear();
      await sendPage.amountInput.blur();
      await sendPage.sendMaxButton.click();
      await sendPage.amountInput.blur();
      test.expect(await sendPage.amountInput.inputValue()).toBeTruthy();
    });

    test('that recipient address matches bns name', async ({ page, sendPage }) => {
      await sendPage.amountInput.fill('.0001');
      await sendPage.recipientInput.fill(TEST_BNS_NAME);
      await sendPage.recipientInput.blur();
      await sendPage.recipientBnsAddressLabel.waitFor();
      await sendPage.recipientBnsAddressInfoIcon.hover();
      const bnsResolvedAddress = await page.getByText(TEST_BNS_RESOLVED_ADDRESS).innerText();

      test.expect(bnsResolvedAddress).toBeTruthy();
    });

    test('that fee row defaults to middle fee estimation', async ({ page }) => {
      const feeToBePaid = await page
        .getByTestId(SharedComponentsSelectors.FeeToBePaidLabel)
        .innerText();
      const fee = Number(feeToBePaid.split(' ')[0]);
      // Using min/max fee caps
      const isMiddleFee = fee >= 0.003 && fee < 0.75;
      test.expect(isMiddleFee).toBeTruthy();
    });

    test('that low fee estimate can be selected', async ({ page }) => {
      await page.getByTestId(SharedComponentsSelectors.MiddleFeeEstimateItem).click();
      await page.getByTestId(SharedComponentsSelectors.LowFeeEstimateItem).click();
      const feeToBePaid = await page
        .getByTestId(SharedComponentsSelectors.FeeToBePaidLabel)
        .innerText();
      const fee = Number(feeToBePaid.split(' ')[0]);
      // Using min/max fee caps
      const isLowFee = fee >= 0.0025 && fee < 0.5;
      test.expect(isLowFee).toBeTruthy();
    });
  });

  test.describe('send form validation', () => {
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

    test('that valid addresses are accepted', async ({ sendPage }) => {
      await sendPage.amountInput.fill('0.000001');
      await sendPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
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

  test.describe('send form preview', () => {
    test('that it shows preview of tx details to be confirmed', async ({ sendPage }) => {
      await sendPage.amountInput.fill('0.000001');
      await sendPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
      await sendPage.waitForFeesSelector();
      await sendPage.previewSendTxButton.click();
      const details = await sendPage.confirmationDetails.allInnerTexts();
      test.expect(details).toBeTruthy();
    });

    test('that it shows preview of tx details after validation error is resolved', async ({
      sendPage,
    }) => {
      await sendPage.amountInput.fill('0.0000001');
      await sendPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
      await sendPage.waitForFeesSelector();
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
      await sendPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
      await sendPage.memoInput.fill(memo);
      await sendPage.waitForFeesSelector();
      const fees = await sendPage.page
        .getByTestId(SharedComponentsSelectors.FeeToBePaidLabel)
        .innerText();
      await sendPage.previewSendTxButton.click();

      const displayerAddress = await getDisplayerAddress(sendPage.confirmationDetailsRecipient);

      test.expect(displayerAddress).toEqual(TEST_ACCOUNT_2_STX_ADDRESS);

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
      await sendPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
      await sendPage.waitForFeesSelector();
      await sendPage.previewSendTxButton.click();

      const confirmationMemo = await sendPage.memoRow
        .getByTestId(SharedComponentsSelectors.InfoCardRowValue)
        .innerText();
      test.expect(confirmationMemo).toEqual(emptyMemoPreviewValue);
    });
  });
});
