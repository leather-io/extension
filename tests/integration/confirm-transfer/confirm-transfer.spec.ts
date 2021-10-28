import { ScreenPaths } from '@common/types';

import { SendPage } from '../../page-objects/send-form.page';
import { WalletPage } from '../../page-objects/wallet.page';
import { BrowserDriver, selectTestNet, setupBrowser } from '../utils';
import { SECRET_KEY_2 } from '@tests/mocks';

jest.setTimeout(30_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe('Confirm transfer of tokens', () => {
  const BEFORE_EACH_TIMEOUT = 60000;

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

    await sendForm.inputToAmountField('0.000001');
    await sendForm.inputToAddressField('ST3TZVW4VTZA1WZN2TB6RQ5J8RACHZYMWMM2N1HT2');
    await selectTestNet(walletPage);

    await sendForm.clickPreviewTxBtn();
    await sendForm.waitForPreview('$transferMessage');
  }, BEFORE_EACH_TIMEOUT);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('preview a transaction before sending', async () => {
    const previewPopup = await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
    expect(previewPopup).toBeTruthy();
  });

  it('with transfer change fees 2x', async () => {
    await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
    await sendForm.clickSettingsBtn();
    await sendForm.click2xBtn();
    const newFee = await sendForm.getCustomFee();
    expect(newFee).toBe(0.144);
  });

  it('with transfer change fees 5x', async () => {
    await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
    await sendForm.clickSettingsBtn();
    await sendForm.click5xBtn();
    const newFee = await sendForm.getCustomFee();
    expect(newFee).toBe(0.36);
  });

  it('with transfer change fees 10x', async () => {
    await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
    await sendForm.clickSettingsBtn();
    await sendForm.click10xBtn();
    const newFee = await sendForm.getCustomFee();
    expect(newFee).toBe(0.72);
  });

  it('transfer Change fees back to 1x', async () => {
    await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
    await sendForm.clickSettingsBtn();
    await sendForm.click10xBtn();
    await sendForm.click1xBtn();
    const newFee = await sendForm.getCustomFee();
    expect(newFee).toBe(0.072);
  });

  it('Change fees manually', async () => {
    await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
    await sendForm.clickSettingsBtn();
    await sendForm.fillToTransferFeeField('0.000001');
    await sendForm.clickFeeApplyBtn();
    await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
    const feeElement = await sendForm.page.$$(sendForm.getSelector('$confirmTransferFee'));
    const feeContent = await feeElement[0].innerText();
    const expectedFee = feeContent.split(/\s+/)[0];
    expect(expectedFee).toBe('0.000001');
  });

  it('Validation error message when the fee has more than 6 decimal places', async () => {
    await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
    await sendForm.clickSettingsBtn();
    await sendForm.fillToTransferFeeField('0.000000001');
    await sendForm.clickFeeApplyBtn();
    const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$inputCustomFeeError'));
    const errorMessage = await errorMsgElement[0].innerText();
    expect(errorMessage).toContain('STX can only have 6 decimals');
  });

  it('Validation error message when there is insufficient balance for fee', async () => {
    await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
    await sendForm.clickSettingsBtn();
    await sendForm.fillToTransferFeeField('999999999');
    await sendForm.clickFeeApplyBtn();
    const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$inputCustomFeeError'));
    const errorMessage = await errorMsgElement[0].innerText();
    expect(errorMessage).toContain('Insufficient balance');
  });

  it('Validation error message when fee is zero', async () => {
    await sendForm.page.isVisible(sendForm.getSelector('$transferMessage'));
    await sendForm.clickSettingsBtn();
    await sendForm.fillToTransferFeeField('0');
    await sendForm.clickFeeApplyBtn();
    const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$inputCustomFeeError'));
    const errorMessage = await errorMsgElement[0].innerText();
    expect(errorMessage).toContain('Amount must be positive');
  });
});
