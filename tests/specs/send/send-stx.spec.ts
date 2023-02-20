import { Page } from '@playwright/test';
import { TEST_BNS_NAME, TEST_BNS_RESOLVED_ADDRESS } from '@tests/mocks/constants';
import { FeesSelectors } from '@tests/selectors/fees.selectors';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { FormErrorMessages } from '@app/common/error-messages';

import { test } from '../../fixtures/fixtures';

test.describe('send stx', () => {
  let testAddress: string;

  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInExistingUser();

    testAddress = await homePage.getReceiveStxAddress();
    await homePage.drawerActionButton.click();

    await homePage.sendButton.click();
    await sendPage.selectStxAndGoToSendForm();
  });

  function selectSendFormFields(page: Page) {
    return {
      amountInput: page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput),
      recipientInput: page.getByTestId(SendCryptoAssetSelectors.RecipientFieldInput),
      memoInput: page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput),
    };
  }

  test.describe('send form input fields', () => {
    // TODO: Doesn't work because test is too fast and the balance hasn't loaded yet
    test.skip('send all button sets available balance minus fee', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.SendMaxBtn).click();
      const input = page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput);
      await input.blur();
      test.expect(await input.inputValue()).toEqual('9.644596');
    });

    test('recipient address matches bns name', async ({ page }) => {
      const { amountInput, recipientInput } = selectSendFormFields(page);

      await amountInput.fill('1');
      await recipientInput.fill(TEST_BNS_NAME);
      await page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput).click();
      await page.getByTestId(SendCryptoAssetSelectors.ResolvedBnsAddressPreview).waitFor();
      await page.getByTestId(SendCryptoAssetSelectors.ResolvedBnsAddressHoverInfoIcon).hover();
      const bnsResolvedAddress = await page.getByText(TEST_BNS_RESOLVED_ADDRESS).innerText();

      test.expect(bnsResolvedAddress).toBeTruthy();
    });

    test('fee row defaults to middle fee estimation', async ({ page }) => {
      const feeToBePaid = await page.getByTestId(FeesSelectors.FeeToBePaidLabel).innerText();
      test.expect(feeToBePaid).toEqual('0.003 STX');
    });

    test('can select low fee estimate', async ({ page }) => {
      await page.getByTestId(FeesSelectors.MiddleFeeEstimateItem).click();
      await page.getByTestId(FeesSelectors.LowFeeEstimateItem).click();
      const feeToBePaid = await page.getByTestId(FeesSelectors.FeeToBePaidLabel).innerText();
      test.expect(feeToBePaid).toEqual('0.0025 STX');
    });
  });

  test.describe('send form validation', () => {
    test('validates that the amount must be number', async ({ page }) => {
      const { amountInput, recipientInput, memoInput } = selectSendFormFields(page);

      await amountInput.fill('aaaaaa');
      await recipientInput.fill('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await memoInput.click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.AmountFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toBeTruthy();
    });

    test('validates against a negative amount of tokens', async ({ page }) => {
      const { amountInput, recipientInput, memoInput } = selectSendFormFields(page);

      await amountInput.fill('-9999');
      await recipientInput.fill('ess-pee');
      await memoInput.click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.AmountFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toEqual('Amount must be positive');
    });

    // Form now enforces a maxLength based on decimals, so this number will be `0.000000`
    test('validates that token amount has more than 6 decimal places', async ({ page }) => {
      const { amountInput, recipientInput, memoInput } = selectSendFormFields(page);

      await amountInput.fill('0.0000001');
      await recipientInput.fill('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await memoInput.click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.AmountFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toEqual('Amount must be positive');
    });

    test('validates that token amount is greater than the available balance', async ({ page }) => {
      const { amountInput, recipientInput, memoInput } = selectSendFormFields(page);

      await amountInput.fill('999999999');
      await recipientInput.fill('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await memoInput.click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.AmountFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toContain('Insufficient balance');
    });

    test('validates against an invalid address', async ({ page }) => {
      const { amountInput, recipientInput, memoInput } = selectSendFormFields(page);

      await amountInput.fill('100000000');
      await recipientInput.fill('slkfjsdlkfjs');
      await memoInput.click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.FormFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toBeTruthy();
    });

    test('does not prohibit valid addresses', async ({ page }) => {
      await page.waitForTimeout(2000);
      const { amountInput, recipientInput } = selectSendFormFields(page);

      await amountInput.fill('0.0001');
      await recipientInput.fill('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await recipientInput.blur();
      await page.waitForTimeout(500);
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const detail = page.getByTestId(SendCryptoAssetSelectors.ConfirmationDetailsAmountAndSymbol);
      test.expect(await detail.innerText()).toContain('STX');
    });

    test('validates that the address used is invalid', async ({ page }) => {
      const { amountInput, recipientInput, memoInput } = selectSendFormFields(page);
      await amountInput.fill('0.000001');
      await recipientInput.fill('ST3TZVWsss4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
      await memoInput.click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.FormFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toContain(FormErrorMessages.InvalidAddress);
    });

    test.skip('validates that the address is same as sender', async ({ page }) => {
      const { amountInput, recipientInput, memoInput } = selectSendFormFields(page);

      await amountInput.fill('0.000001');
      await recipientInput.fill(testAddress);
      await memoInput.click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.FormFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toContain(FormErrorMessages.SameAddress);
    });
  });

  test.describe('send form preview', () => {
    test('shows preview to confirm transaction', async ({ page }) => {
      const { amountInput, recipientInput, memoInput } = selectSendFormFields(page);

      await amountInput.fill('0.000001');
      await recipientInput.fill('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await memoInput.click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const details = await page
        .getByTestId(SendCryptoAssetSelectors.ConfirmationDetails)
        .allInnerTexts();
      test.expect(details).toBeTruthy();
    });

    test('shows preview after validation error is resolved', async ({ page }) => {
      const { amountInput, recipientInput, memoInput } = selectSendFormFields(page);

      await amountInput.fill('0.0000001');
      await recipientInput.fill('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');

      await memoInput.click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.AmountFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toEqual('Amount must be positive');

      await amountInput.fill('0.000001');
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const details = await page
        .getByTestId(SendCryptoAssetSelectors.ConfirmationDetails)
        .allInnerTexts();
      test.expect(details).toBeTruthy();
    });
  });
});
