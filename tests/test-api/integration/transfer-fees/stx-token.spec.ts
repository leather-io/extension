import { RouteUrls } from '@shared/route-urls';

import { SendPage } from '@tests/page-objects/send-form.page';
import { WalletPage } from '@tests/page-objects/wallet.page';
import { addAPINetwork, BrowserDriver, setupBrowser } from '@tests/integration/utils';
import { APINetworkRecipientAddress, SECRET_KEY_2 } from '@tests/mocks';
import { SendFormErrorMessages } from '@app/common/error-messages';

jest.setTimeout(60_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe('Confirm transfer of tokens', () => {
  const BEFORE_EACH_TIMEOUT = 60000;

  let browser: BrowserDriver;
  let walletPage: WalletPage;
  let sendForm: SendPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    walletPage = await WalletPage.init(browser, RouteUrls.Onboarding);
    await walletPage.signIn(SECRET_KEY_2);
    await walletPage.waitForHomePage();
    await addAPINetwork(walletPage);

    await walletPage.waitForSendButton();
    await walletPage.goToSendForm();
    sendForm = new SendPage(walletPage.page);
  }, BEFORE_EACH_TIMEOUT);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  describe('For STX Token', () => {
    beforeEach(async () => {
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField(APINetworkRecipientAddress);
    });

    it('when fees is low', async () => {
      await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
      await sendForm.selectLowFeeOption();
      await sendForm.clickPreviewTxBtn();
      await sendForm.waitForPreview('$transferMessage');
      const previewPopup = await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
      expect(previewPopup).toBeTruthy();
    });

    it('when fees is standard', async () => {
      await sendForm.clickPreviewTxBtn();
      await sendForm.waitForPreview('$transferMessage');
      const previewPopup = await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
      expect(previewPopup).toBeTruthy();
    });

    it('when fees is high', async () => {
      await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
      await sendForm.selectHighFeeOption();
      await sendForm.clickPreviewTxBtn();
      await sendForm.waitForPreview('$transferMessage');
      const previewPopup = await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
      expect(previewPopup).toBeTruthy();
    });

    it('when fees is custom', async () => {
      await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
      await sendForm.selectCustomFeeOption();
      await sendForm.inputFee('0.002');
      const amountFee = await sendForm.getCustomFeeValue();
      expect(amountFee).toBe('0.002');

      await sendForm.clickPreviewTxBtn();
      await sendForm.waitForPreview('$transferMessage');
      const previewPopup = await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
      expect(previewPopup).toBeTruthy();
    });

    it('validates that custom fee has more than 6 decimal places', async () => {
      await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
      await sendForm.selectCustomFeeOption();
      await sendForm.inputFee('0.0000001');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$feeError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toEqual('STX can only have 6 decimals');
    });

    it('validates that custom fee must be positive', async () => {
      await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
      await sendForm.selectCustomFeeOption();
      await sendForm.inputFee('-1');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$feeError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toEqual('Amount must be positive');
    });

    it('validates that the memo must be less than 34-bytes', async () => {
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField('ST3TZVW4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
      await sendForm.inputToMemoField(
        'lorem-ipsum-lorem-ipsum-lorem-ipsum-lorem-ipsum-lorem-ipsum-lorem-ipsum'
      );
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$memoFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toContain(SendFormErrorMessages.MemoExceedsLimit);
    });
  });

  describe('For STX Token', () => {
    beforeEach(async () => {
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField(APINetworkRecipientAddress);
    });

    it('verify that the transaction shows on the ACTIVITY tab', async () => {
      await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
      await sendForm.selectLowFeeOption();
      await sendForm.clickPreviewTxBtn();
      await sendForm.waitForPreview('$transferMessage');
      await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
      await sendForm.clickSendToken();
      await walletPage.waitForMainHomePage();
      await walletPage.page.waitForTimeout(5000);
      const sentTokenElem = await sendForm.page.$$(sendForm.getSelector('$sentTokenValue'));
      const sentTokenValue = await sentTokenElem[0].innerText();
      expect(sentTokenValue).toEqual('-0.000001');
    });
  });
});
