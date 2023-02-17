import { TEST_BNS_NAME, TEST_BNS_RESOLVED_ADDRESS } from '@tests/mocks/constants';
import { FeesSelectors } from '@tests/selectors/fees.selectors';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { formatErrorWithSymbol } from '@app/common/error-formatters';
import { FormErrorMessages } from '@app/common/error-messages';

import { test } from '../../fixtures/fixtures';

test.describe('send stx', () => {
  let testAddress: string;

  // TODO: Remove with legacy send form
  test.beforeEach(async () => {
    test.skip();
  });

  // TODO: Use with new send form
  // test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
  //   await globalPage.setupAndUseApiCalls(extensionId);
  //   await onboardingPage.signInExistingUser();

  //   testAddress = await homePage.getReceiveStxAddress();
  //   await homePage.drawerActionButton.click();

  //   await homePage.sendButton.click();
  //   await sendPage.selectStxAndGoToSendForm();
  // });

  test.describe('send form input fields', () => {
    test('send all button sets available balance minus fee', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.SendMaxBtn).click();
      const inputValue = await page
        .getByTestId(SendCryptoAssetSelectors.AmountFieldInput)
        .inputValue();
      test.expect(inputValue).toEqual('9.644596');
    });

    test('recipient address matches bns name', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('1');
      await page.getByTestId(SendCryptoAssetSelectors.RecipientFieldInput).fill(TEST_BNS_NAME);
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
      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('aaaaaa');
      await page
        .getByTestId(SendCryptoAssetSelectors.RecipientFieldInput)
        .fill('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput).click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.AmountFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toContain(formatErrorWithSymbol('STX', FormErrorMessages.MustBeNumber));
    });

    test('validates against a negative amount of tokens', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('-9999');
      await page.getByTestId(SendCryptoAssetSelectors.RecipientFieldInput).fill('ess-pee');
      await page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput).click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.AmountFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toEqual('Amount must be positive');
    });

    test('validates that token amount has more than 6 decimal places', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('0.0000001');
      await page
        .getByTestId(SendCryptoAssetSelectors.RecipientFieldInput)
        .fill('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput).click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.AmountFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toEqual('STX can only have 6 decimals');
    });

    test('validates that token amount is greater than the available balance', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('999999999');
      await page
        .getByTestId(SendCryptoAssetSelectors.RecipientFieldInput)
        .fill('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput).click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.AmountFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toContain('Insufficient balance');
    });

    test('validates against an invalid address', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('100000000');
      await page.getByTestId(SendCryptoAssetSelectors.RecipientFieldInput).fill('slkfjsdlkfjs');
      await page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput).click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.FormFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toBeTruthy();
    });

    test('does not prohibit valid addresses', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('0.000001');
      await page
        .getByTestId(SendCryptoAssetSelectors.RecipientFieldInput)
        .fill('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput).click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const detail = await page
        .getByTestId(SendCryptoAssetSelectors.ConfirmationDetailsAmountAndSymbol)
        .innerText();
      test.expect(detail).toContain('STX');
    });

    test('validates that the address used is from different network', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('0.000001');
      await page
        .getByTestId(SendCryptoAssetSelectors.RecipientFieldInput)
        .fill('STRE7HABZGQ204G3VQAKMDMVBBD8A8CYKET9M0T');
      await page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput).click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.FormFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toContain(FormErrorMessages.IncorrectNetworkAddress);
    });

    test('validates that the address used is invalid', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('0.000001');
      await page
        .getByTestId(SendCryptoAssetSelectors.RecipientFieldInput)
        .fill('ST3TZVWsss4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
      await page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput).click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.FormFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toContain(FormErrorMessages.InvalidAddress);
    });

    test('validates that the address is same as sender', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('0.000001');
      await page.getByTestId(SendCryptoAssetSelectors.RecipientFieldInput).fill(testAddress);
      await page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput).click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.FormFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toContain(FormErrorMessages.SameAddress);
    });
  });

  test.describe('send form preview', () => {
    test('shows preview to confirm transaction', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('0.000001');
      await page
        .getByTestId(SendCryptoAssetSelectors.RecipientFieldInput)
        .fill('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput).click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const details = await page
        .getByTestId(SendCryptoAssetSelectors.ConfirmationDetails)
        .allInnerTexts();
      test.expect(details).toBeTruthy();
    });

    test('shows preview after validation error is resolved', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('0.0000001');
      await page
        .getByTestId(SendCryptoAssetSelectors.RecipientFieldInput)
        .fill('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput).click();
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const errorMsg = await page
        .getByTestId(SendCryptoAssetSelectors.AmountFieldInputErrorLabel)
        .innerText();
      test.expect(errorMsg).toEqual('STX can only have 6 decimals');

      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('0.000001');
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const details = await page
        .getByTestId(SendCryptoAssetSelectors.ConfirmationDetails)
        .allInnerTexts();
      test.expect(details).toBeTruthy();
    });
  });
});
