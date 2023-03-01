import {
  TEST_ACCOUNT_2_STX_ADDRESS,
  TEST_BNS_NAME,
  TEST_BNS_RESOLVED_ADDRESS,
} from '@tests/mocks/constants';
import { FeesSelectors } from '@tests/selectors/fees.selectors';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

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
      await sendPage.amountInput.fill('1');
      await sendPage.amountInput.clear();
      await sendPage.sendMaxButton.click();
      await sendPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
      test.expect(await sendPage.amountInput.inputValue()).toBeTruthy();
    });

    test('that recipient address matches bns name', async ({ page, sendPage }) => {
      await sendPage.amountInput.fill('1');
      await sendPage.recipientInput.fill(TEST_BNS_NAME);
      await sendPage.recipientInput.blur();
      await sendPage.resolvedBnsAddressLabel.waitFor();
      await sendPage.resolvedBnsAddressInfoIcon.hover();
      const bnsResolvedAddress = await page.getByText(TEST_BNS_RESOLVED_ADDRESS).innerText();

      test.expect(bnsResolvedAddress).toBeTruthy();
    });

    test('that fee row defaults to middle fee estimation', async ({ page }) => {
      const feeToBePaid = await page.getByTestId(FeesSelectors.FeeToBePaidLabel).innerText();
      test.expect(feeToBePaid).toEqual('0.003 STX');
    });

    test('that low fee estimate can be selected', async ({ page }) => {
      await page.getByTestId(FeesSelectors.MiddleFeeEstimateItem).click();
      await page.getByTestId(FeesSelectors.LowFeeEstimateItem).click();
      const feeToBePaid = await page.getByTestId(FeesSelectors.FeeToBePaidLabel).innerText();
      test.expect(feeToBePaid).toEqual('0.0025 STX');
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

    test('that valid addresses are accepted', async ({ page, sendPage }) => {
      await sendPage.amountInput.fill('0.0001');
      await sendPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
      await sendPage.recipientInput.blur();
      await sendPage.previewSendTxButton.click();
      const detail = page.getByTestId(SendCryptoAssetSelectors.ConfirmationDetailsAmountAndSymbol);
      test.expect(await detail.innerText()).toContain('STX');
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
      await sendPage.previewSendTxButton.click();
      const details = await sendPage.confirmationDetails.allInnerTexts();
      test.expect(details).toBeTruthy();
    });

    test('that it shows preview of tx details after validation error is resolved', async ({
      sendPage,
    }) => {
      await sendPage.amountInput.fill('0.0000001');
      await sendPage.recipientInput.fill(TEST_ACCOUNT_2_STX_ADDRESS);
      await sendPage.previewSendTxButton.click();
      const errorMsg = await sendPage.amountInputErrorLabel.innerText();
      test.expect(errorMsg).toEqual(FormErrorMessages.MustBePositive);

      await sendPage.amountInput.fill('0.000001');
      await sendPage.previewSendTxButton.click();
      const details = await sendPage.confirmationDetails.allInnerTexts();
      test.expect(details).toBeTruthy();
    });
  });
});
