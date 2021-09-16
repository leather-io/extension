import {ScreenPaths} from '@common/types';

import {SendPage} from '../../page-objects/send-form.page';
import {WalletPage} from '../../page-objects/wallet.page';
import {BrowserDriver, setupBrowser} from '../utils';
import {SECRET_KEY_2} from "@tests/mocks";

jest.setTimeout(30_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe(`Send tokens flow`, () => {
  let browser: BrowserDriver;
  let walletPage: WalletPage;
  let sendForm: SendPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    walletPage = await WalletPage.init(browser, ScreenPaths.INSTALLED);
    await walletPage.signUp();
    await walletPage.waitForHomePage();
    await walletPage.goToSendForm();
    sendForm = new SendPage(walletPage.page);
  }, 30_000);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {
    }
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

  describe('Form validation', () => {
    it('validates against an invalid address', async () => {
      await sendForm.inputToAmountField('100000000');
      await sendForm.inputToAddressField('slkfjsdlkfjs');
      await sendForm.clickPreviewTxBtn();
      const errorMsg = await sendForm.page.isVisible(sendForm.getSelector('$stxAddressFieldError'));
      expect(errorMsg).toBeTruthy();
    });

    it('does not prohibit valid addresses', async () => {
      await sendForm.inputToAmountField('100000000');
      await sendForm.inputToAddressField('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await sendForm.clickPreviewTxBtn();
      const errorMsg = await sendForm.page.isVisible(sendForm.getSelector('$stxAddressFieldError'));
      expect(errorMsg).toBeFalsy();
    });

    it('validates that the address used is from different network', async () => {
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField('STRE7HABZGQ204G3VQAKMDMVBBD8A8CYKET9M0T');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$stxAddressFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toContain('The address is for the incorrect Stacks network');
    });

    it('validates against a negative amount of tokens', async () => {
      await sendForm.inputToAmountField('-9999');
      await sendForm.inputToAddressField('ess-pee');
      await sendForm.clickPreviewTxBtn();
      const errorMsg = await sendForm.page.isVisible(sendForm.getSelector('$amountFieldError'));
      expect(errorMsg).toBeTruthy();
    });

    it('validates that token amount has more than 6 decimal places', async () => {
      await sendForm.inputToAmountField('0.0000001');
      await sendForm.inputToAddressField('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toEqual('STX can only have 6 decimals');
    });

    it('validates that token amount is greater than the available balance', async () => {
      await sendForm.inputToAmountField('999999999');
      await sendForm.inputToAddressField('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
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
    walletPage = await WalletPage.init(browser, ScreenPaths.INSTALLED);
    await walletPage.signIn(SECRET_KEY_2);
    await walletPage.waitForHomePage();
    await walletPage.goToSendForm();
    sendForm = new SendPage(walletPage.page);
  }, 30_000);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {
    }
  });

  it('expect that the preview is shown', async () => {
    await sendForm.inputToAmountField('0.000001');
    await sendForm.inputToAddressField('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
    await sendForm.clickPreviewTxBtn();
    await sendForm.waitForPreview('$transferMessage');
    const previewPopup = await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
    expect(previewPopup).toBeTruthy();
  });

  it('expect that the preview is shown when there is a validation error on token amount and later it is resolved', async () => {
    await sendForm.fillToAmountField('0.0000001');
    await sendForm.inputToAddressField('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
    await sendForm.clickPreviewTxBtn();
    const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
    const errorMessage = await errorMsgElement[0].innerText();
    expect(errorMessage).toEqual('STX can only have 6 decimals');

    await sendForm.fillToAmountField('0.000001');
    await sendForm.clickPreviewTxBtn();
    await sendForm.waitForPreview('$transferMessage');
    const previewPopup = await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
    expect(previewPopup).toBeTruthy();
  });

});
