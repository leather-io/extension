import { TEST_ACCOUNT_2_BTC_ADDRESS } from '@tests/mocks/constants';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { test } from '../../fixtures/fixtures';

test.describe('send btc', () => {
  // TODO: Don't run these if we disable bitcoin sending
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInExistingUser();

    await homePage.sendButton.click();
    await sendPage.selectBtcAndGoToSendForm();
  });

  test.describe('btc send form', () => {
    test('can preview and send btc', async ({ page }) => {
      await page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput).fill('0.000001');
      await page
        .getByTestId(SendCryptoAssetSelectors.RecipientFieldInput)
        .fill(TEST_ACCOUNT_2_BTC_ADDRESS);
      await page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn).click();
      const details = await page
        .getByTestId(SendCryptoAssetSelectors.ConfirmationDetails)
        .allInnerTexts();
      test.expect(details).toBeTruthy();

      const requestPromise = page.waitForRequest(/tx/);
      await page.getByTestId(SendCryptoAssetSelectors.ConfirmSendTxBtn).click();
      const request = await requestPromise;
      const txData = request.postData();
      const method = request.method();
      const postUrl = request.url();
      test.expect(txData).toBeTruthy();
      test.expect(method).toEqual('POST');
      test.expect(postUrl).toEqual('https://blockstream.info/api/tx');
    });
  });
});
