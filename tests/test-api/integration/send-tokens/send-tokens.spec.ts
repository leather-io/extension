import { RouteUrls } from '@shared/route-urls';
import { SECRET_KEY_2 } from '@tests/mocks';

import { SendPage } from '../../../page-objects/send-form.page';
import { WalletPage } from '../../../page-objects/wallet.page';
import {
  BrowserDriver,
  setupBrowser,
  addAPINetwork
} from '../../../integration/utils';

jest.setTimeout(120_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe('Preview for sending token', () => {
  let browser: BrowserDriver;
  let walletPage: WalletPage;
  let sendForm: SendPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    walletPage = await WalletPage.init(browser, RouteUrls.Onboarding);
    await walletPage.signIn(SECRET_KEY_2);
    await walletPage.waitForHomePage();
    await addAPINetwork(walletPage);
    await walletPage.goToSendForm();
    sendForm = new SendPage(walletPage.page);
    await sendForm.waitForSendMaxButton();
  }, 40_000);

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
