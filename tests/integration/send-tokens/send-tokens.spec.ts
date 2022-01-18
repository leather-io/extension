import { delay } from '@app/common/utils';
import { RouteUrls } from '@shared/route-urls';
import { SECRET_KEY_2 } from '@tests/mocks';

import { SendPage } from '../../page-objects/send-form.page';
import { WalletPage } from '../../page-objects/wallet.page';
import { BrowserDriver, setupBrowser } from '../utils';

jest.setTimeout(60_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe(`Send tokens flow`, () => {
  let browser: BrowserDriver;
  let walletPage: WalletPage;
  let sendForm: SendPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    walletPage = await WalletPage.init(browser, RouteUrls.Onboarding);
    await walletPage.clickAllowAnalytics();
    await walletPage.signIn(SECRET_KEY_2);
    await walletPage.waitForHomePage();
    await walletPage.goToSendForm();
    sendForm = new SendPage(walletPage.page);
    await sendForm.waitForSendMaxButton();
  }, 30_000);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  describe('Set max button', () => {
    it('does not set a fee below zero, when the account balance is 0 STX', async () => {
      await sendForm.clickSendMaxBtn();
      const amount = await sendForm.getAmountFieldValue();
      expect(amount).toEqual('');
      expect(amount).not.toEqual('-0.00018');
      expect(Number(amount)).not.toBeLessThan(0);
    });
  });

  describe('Fee row', () => {
    it('defaults to the middle fee estimate', async () => {
      await sendForm.inputToAmountField('100000000');
      await sendForm.inputToAddressField('slkfjsdlkfjs');
      const defaultFeeEstimate = await sendForm.page.$(sendForm.getSelector('$feeEstimateItem'));
      const label = await defaultFeeEstimate?.innerText();
      await delay(500);
      expect(label).toEqual('Standard');
    });

    it('can select the low fee estimate', async () => {
      await sendForm.inputToAmountField('100000000');
      await sendForm.inputToAddressField('slkfjsdlkfjs');
      await sendForm.selectFirstFeeEstimate();
      const lowFeeEstimate = await sendForm.page.$(sendForm.getSelector('$feeEstimateItem'));
      const label = await lowFeeEstimate?.innerText();
      expect(label).toEqual('Low');
    });
  });

  describe('Form validation', () => {
    it('validates against an invalid address', async () => {
      await sendForm.inputToAmountField('100000000');
      await sendForm.inputToAddressField('slkfjsdlkfjs');
      await sendForm.inputToCustomFeeField('0.00001');
      await sendForm.clickPreviewTxBtn();
      const errorMsg = await sendForm.page.isVisible(sendForm.getSelector('$stxAddressFieldError'));
      expect(errorMsg).toBeTruthy();
    });

    it('does not prohibit valid addresses', async () => {
      await sendForm.inputToAmountField('100000000');
      await sendForm.inputToAddressField('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await sendForm.inputToCustomFeeField('0.00001');
      await sendForm.clickPreviewTxBtn();
      const errorMsg = await sendForm.page.isVisible(sendForm.getSelector('$stxAddressFieldError'));
      expect(errorMsg).toBeFalsy();
    });

    it('validates that the address used is from different network', async () => {
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField('STRE7HABZGQ204G3VQAKMDMVBBD8A8CYKET9M0T');
      await sendForm.inputToCustomFeeField('0.00001');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$stxAddressFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toContain('The address is for the incorrect Stacks network');
    });

    it('validates against a negative amount of tokens', async () => {
      await sendForm.inputToAmountField('-9999');
      await sendForm.inputToAddressField('ess-pee');
      await sendForm.inputToCustomFeeField('0.00001');
      await sendForm.clickPreviewTxBtn();
      const errorMsg = await sendForm.page.isVisible(sendForm.getSelector('$amountFieldError'));
      expect(errorMsg).toBeTruthy();
    });

    it('validates that token amount has more than 6 decimal places', async () => {
      await sendForm.inputToAmountField('0.0000001');
      await sendForm.inputToAddressField('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await sendForm.inputToCustomFeeField('0.00001');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toEqual('STX can only have 6 decimals');
    });

    it('validates that token amount is greater than the available balance', async () => {
      await sendForm.inputToAmountField('999999999');
      await sendForm.inputToAddressField('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await sendForm.inputToCustomFeeField('0.00001');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toContain('Insufficient balance');
    });
  });
});

describe('Preview for sending token', () => {
  let browser: BrowserDriver;
  let walletPage: WalletPage;
  let sendForm: SendPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    walletPage = await WalletPage.init(browser, RouteUrls.Onboarding);
    await walletPage.clickAllowAnalytics();
    await walletPage.signIn(SECRET_KEY_2);
    await walletPage.waitForHomePage();
    await walletPage.goToSendForm();
    sendForm = new SendPage(walletPage.page);
    await sendForm.waitForSendMaxButton();
  }, 30_000);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('should show the preview', async () => {
    await sendForm.inputToAmountField('0.000001');
    await sendForm.inputToAddressField('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
    await sendForm.inputToCustomFeeField('0.00001');
    await sendForm.clickPreviewTxBtn();
    await sendForm.waitForConfirmDetails();
    const previewPopup = await sendForm.page.isVisible(sendForm.getSelector('$confirmDetails'));
    expect(previewPopup).toBeTruthy();
  });

  it('should show preview after validation error is resolved', async () => {
    await sendForm.fillToAmountField('0.0000001');
    await sendForm.inputToAddressField('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
    await sendForm.inputToCustomFeeField('0.00001');
    await sendForm.clickPreviewTxBtn();
    const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
    const errorMessage = await errorMsgElement[0].innerText();
    expect(errorMessage).toEqual('STX can only have 6 decimals');

    await sendForm.fillToAmountField('0.000001');
    await sendForm.clickPreviewTxBtn();
    await sendForm.waitForConfirmDetails();
    const previewPopup = await sendForm.page.isVisible(sendForm.getSelector('$confirmDetails'));
    expect(previewPopup).toBeTruthy();
  });
});
