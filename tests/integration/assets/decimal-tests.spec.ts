import { RouteUrls } from '@shared/route-urls';

import { SendPage } from '@tests/page-objects/send-form.page';
import { WalletPage } from '@tests/page-objects/wallet.page';
import { BrowserDriver, createTestSelector, setupBrowser } from '@tests/integration/utils';
import { APINetworkRecipientAddress, SECRET_KEY_2 } from '@tests/mocks';
import { SettingsSelectors } from '@tests/integration/settings.selectors';

jest.setTimeout(60_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe('Confirm transfer of tokens with decimals', () => {
  const BEFORE_EACH_TIMEOUT = 60000;

  let browser: BrowserDriver;
  let walletPage: WalletPage;
  let sendForm: SendPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    walletPage = await WalletPage.init(browser, RouteUrls.Onboarding);
    await walletPage.signIn(SECRET_KEY_2);
    await walletPage.waitForSettingsButton();
    await walletPage.clickSettingsButton();
    await walletPage.page.click(createTestSelector(SettingsSelectors.SwitchAccount));
    // switch to account 2
    await walletPage.page.click(createTestSelector(`switch-account-item-1`));
    await walletPage.page.waitForTimeout(3000);

    await walletPage.waitForSendButton();
    await walletPage.goToSendForm();
    sendForm = new SendPage(walletPage.page);
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

  describe('For DIKO tokens', () => {
    beforeEach(async () => {
      await sendForm.clickDIKOtokenOption();
    });

    it('validates that token amount has more than 6 decimal places', async () => {
      await sendForm.inputToAmountField('0.0000001');
      await sendForm.inputToAddressField(APINetworkRecipientAddress);
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toEqual('DIKO can only have 6 decimals');
    });

    it('no error with 6 decimal digits', async () => {
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField(APINetworkRecipientAddress);
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0]?.innerText();
      expect(errorMessage).toBeUndefined();
    });
  });

  describe('For Miami Coin', () => {
    beforeEach(async () => {
      await sendForm.clickMiamiCointokenOption();
    });

    it('validates that amount must be more than 0', async () => {
      await sendForm.inputToAmountField('-1');
      await sendForm.inputToAddressField(APINetworkRecipientAddress);
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toEqual('Must be more than zero');
    });

    it('no error with 1 coin', async () => {
      await sendForm.inputToAmountField('1');
      await sendForm.inputToAddressField(APINetworkRecipientAddress);
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0]?.innerText();
      expect(errorMessage).toBeUndefined();
    });
  });

  describe('For STSW tokens', () => {
    beforeEach(async () => {
      await sendForm.clickSTSWTokenOption();
    });

    it('validates that token amount has more than 6 decimal places', async () => {
      await sendForm.inputToAmountField('0.0000001');
      await sendForm.inputToAddressField(APINetworkRecipientAddress);
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toEqual('STSW can only have 6 decimals');
    });

    it('no error with 6 decimal digits', async () => {
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField(APINetworkRecipientAddress);
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0]?.innerText();
      expect(errorMessage).toBeUndefined();
    });
  });

  describe('For USDA tokens', () => {
    beforeEach(async () => {
      await sendForm.clickUSDAtokenOption();
    });

    it('validates that token amount has more than 6 decimal places', async () => {
      await sendForm.inputToAmountField('0.0000001');
      await sendForm.inputToAddressField(APINetworkRecipientAddress);
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0].innerText();
      expect(errorMessage).toEqual('USDA can only have 6 decimals');
    });

    it('no error with 6 decimal digits', async () => {
      await sendForm.inputToAmountField('0.000001');
      await sendForm.inputToAddressField(APINetworkRecipientAddress);
      await sendForm.clickPreviewTxBtn();
      const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$amountFieldError'));
      const errorMessage = await errorMsgElement[0]?.innerText();
      expect(errorMessage).toBeUndefined();
    });
  });
});
