import { TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS } from '@tests/mocks/constants';
import { mockOrdinalsComApiHtmlResponse } from '@tests/mocks/mock-ordinalscom-api';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { getDisplayerAddress } from '@tests/utils';

import { BESTINSLOT_API_BASE_URL_TESTNET, BtcFeeType } from '@leather.io/models';

import { test } from '../../fixtures/fixtures';

test.describe('send btc', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, sendPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.selectTestnet();
    await homePage.sendButton.click();
    await sendPage.selectBtcAndGoToSendForm();
    await sendPage.waitForSendPageReady();
  });

  test.describe('btc send form', () => {
    test('that it shows preview of tx details to be confirmed', async ({ sendPage }) => {
      await sendPage.amountInput.fill('0.00006');
      await sendPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS);

      await sendPage.previewSendTxButton.click();
      await sendPage.feesListItem.filter({ hasText: BtcFeeType.Low }).click();

      const details = await sendPage.confirmationDetails.allInnerTexts();
      test.expect(details).toBeTruthy();
    });

    test('that recipient input is trimmed correctly', async ({ sendPage }) => {
      await sendPage.amountInput.fill('0.00006');
      await sendPage.recipientInput.fill(' ' + TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS + ' ');
      await sendPage.recipientInput.blur();
      await sendPage.page.waitForTimeout(1000);
      await sendPage.previewSendTxButton.click();
      await sendPage.feesListItem.filter({ hasText: BtcFeeType.Low }).click();

      const displayerAddress = await getDisplayerAddress(sendPage.confirmationDetailsRecipient);
      test.expect(displayerAddress).toEqual(TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS);
    });

    test('that asset value and recipient on preview match input', async ({ sendPage }) => {
      const amount = '0.00006';
      const amountSymbol = 'BTC';

      await sendPage.amountInput.fill(amount);
      await sendPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS);
      await sendPage.recipientInput.blur();
      await sendPage.page.waitForTimeout(1000);

      await sendPage.previewSendTxButton.click();
      await sendPage.feesListItem.filter({ hasText: BtcFeeType.Low }).click();

      const displayerAddress = await getDisplayerAddress(sendPage.confirmationDetailsRecipient);
      test.expect(displayerAddress).toEqual(TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS);

      const confirmationAssetValue = await sendPage.confirmationDetails
        .getByTestId(SharedComponentsSelectors.InfoCardAssetValue)
        .innerText();
      test.expect(confirmationAssetValue).toEqual(`${amount} ${amountSymbol}`);
    });

    test('that fee value on preview match chosen one', async ({ sendPage }) => {
      await sendPage.amountInput.fill('0.00006');
      await sendPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS);

      await sendPage.previewSendTxButton.click();

      const feeType = BtcFeeType.Standard;
      const fee = await sendPage.feesListItem
        .filter({ hasText: feeType })
        .getByTestId(SharedComponentsSelectors.FeesListItemFeeValue)
        .innerText();

      await sendPage.feesListItem.filter({ hasText: feeType }).click();

      const confirmationFee = await sendPage.confirmationDetails
        .getByTestId(SendCryptoAssetSelectors.ConfirmationDetailsFee)
        .getByTestId(SharedComponentsSelectors.InfoCardRowValue)
        .innerText();

      test.expect(fee).toContain(confirmationFee);
    });

    test('that prevents transaction if it contains inscribed utxo', async ({ sendPage }) => {
      await sendPage.page.route('**/ordinals-explorer.generative.xyz/**', async route => {
        return route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: mockOrdinalsComApiHtmlResponse,
        });
      });
      await sendPage.amountInput.fill('0.00006');
      await sendPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS);

      await sendPage.previewSendTxButton.click();
      await sendPage.feesListItem.filter({ hasText: BtcFeeType.Low }).click();

      await sendPage.clickInfoCardButton();

      await test.expect(sendPage.broadcastErrorTitle).toBeVisible();
    });

    test('that fallbacks to other api provider if main fails', async ({ sendPage }) => {
      let output = '';
      let id = '';
      let index = '';

      await sendPage.page.route('**/ordinals-explorer.generative.xyz/**', async route => {
        return route.fulfill({
          status: 500,
          contentType: 'text/html',
          body: mockOrdinalsComApiHtmlResponse,
        });
      });

      sendPage.page.on('request', async request => {
        if (request.url().includes('ordinals-explorer.generative.xyz')) {
          const url = request.url();
          output = url.split('/').pop() || '';
          id = output.split(':')[0];
          index = output.split(':')[1];
        }
      });

      await sendPage.page.route(
        `${BESTINSLOT_API_BASE_URL_TESTNET}/inscription/in_transaction**`,
        async route => {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: [{ txid: id, output, index, satpoint: output }],
            }),
          });
        }
      );

      await sendPage.page.route(
        `${BESTINSLOT_API_BASE_URL_TESTNET}/inscription/single_info_id**`,
        async route => {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: { txid: id, output, index, satpoint: output },
            }),
          });
        }
      );
      await sendPage.amountInput.fill('0.00006');
      await sendPage.recipientInput.fill(TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS);

      await sendPage.previewSendTxButton.click();
      await sendPage.feesListItem.filter({ hasText: BtcFeeType.Low }).click();

      await sendPage.clickInfoCardButton();

      await test.expect(sendPage.broadcastErrorTitle).toBeVisible();
    });
  });
});
