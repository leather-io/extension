import { RouteUrls } from '@shared/route-urls';

import { SendPage } from '../../page-objects/send-form.page';
import { WalletPage } from '../../page-objects/wallet.page';
import { BrowserDriver, selectTestNet, setupBrowser } from '../utils';
import { SECRET_KEY_2 } from '@tests/mocks';
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
    await walletPage.goToSendForm();
    sendForm = new SendPage(walletPage.page);
    await selectTestNet(walletPage);
    await sendForm.waitForAmountField();

    const isSelectedAsset = await sendForm.page.isVisible(
      sendForm.getSelector('$selectedAssetOption')
    );
    if (isSelectedAsset) {
      await sendForm.waitForSelectedAssetOption();
      await sendForm.clickSelectedAsset();
    } else {
      await sendForm.waitForAssetSelect();
      await sendForm.clickAssetSelect();
    }
  }, BEFORE_EACH_TIMEOUT);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  describe('For STX Token', () => {
    beforeEach(async () => {
      await sendForm.clickSTXTokenOption();
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField('ST3TZVW4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
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
      await sendForm.clickSTXTokenOption();
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField('ST3YM8278PT1DGVRXVEZJ0AXF38MG8VGYRYMECD3D');
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
      const pendingStatus = await sendForm.page.isVisible(sendForm.getSelector('$pendingStatus'));
      expect(pendingStatus).toBeTruthy();
      const sentTokenElem = await sendForm.page.$$(sendForm.getSelector('$sentTokenValue'));
      const sentTokenValue = await sentTokenElem[0].innerText();
      expect(sentTokenValue).toEqual('-0.000001');
    });
  });

  describe('For STELLA Token', () => {
    beforeEach(async () => {
      await sendForm.clickStellaTokenOption();
    });

    it('when fees is low', async () => {
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField('ST3TZVW4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
      await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
      await sendForm.selectLowFeeOption();
      await sendForm.clickPreviewTxBtn();
      await sendForm.waitForPreview('$transferMessage');
      const previewPopup = await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
      expect(previewPopup).toBeTruthy();
    });

    it('when fees is standard', async () => {
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField('ST3TZVW4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
      await sendForm.clickPreviewTxBtn();
      await sendForm.waitForPreview('$transferMessage');
      const previewPopup = await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
      expect(previewPopup).toBeTruthy();
    });

    it('when fees is high', async () => {
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField('ST3TZVW4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
      await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
      await sendForm.selectHighFeeOption();
      await sendForm.clickPreviewTxBtn();
      await sendForm.waitForPreview('$transferMessage');
      const previewPopup = await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
      expect(previewPopup).toBeTruthy();
    });

    it('when fees is custom', async () => {
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField('ST3TZVW4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
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
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField('ST3TZVW4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
      await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
      await sendForm.selectCustomFeeOption();
      await sendForm.inputFee('0.0000001');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$feeError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toEqual('STX can only have 6 decimals');
    });

    it('validates that custom fee must be positive', async () => {
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField('ST3TZVW4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
      await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
      await sendForm.selectCustomFeeOption();
      await sendForm.inputFee('-1');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$feeError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toEqual('Amount must be positive');
    });

    it('validates that the amount must be more than zero', async () => {
      await sendForm.inputToAmountField('0');
      await sendForm.inputToAddressField('ST3TZVW4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toContain(SendFormErrorMessages.MustNotBeZero);
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

    it('validates that the amount field can have only 9 decimals', async () => {
      await sendForm.inputToAmountField('0.00000000001');
      await sendForm.inputToAddressField('ST3TZVW4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toContain(SendFormErrorMessages.Only9Decimals);
    });

    it('validates that the amount field can only be number', async () => {
      await sendForm.inputToAmountField('aaaa');
      await sendForm.inputToAddressField('ST3TZVW4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toContain(SendFormErrorMessages.CastToNumber);
    });

    it('validates that the address is for the incorrect Stacks network', async () => {
      await sendForm.inputToAmountField('0.00000001');
      await sendForm.inputToAddressField('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$stxAddressFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toContain(SendFormErrorMessages.IncorrectAddressMode);
    });

    it('validates that amount is greater than the available balance', async () => {
      await sendForm.inputToAmountField('999999999');
      await sendForm.inputToAddressField('ST3TZVW4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toContain(SendFormErrorMessages.InsufficientBalance);
    });
  });
});
