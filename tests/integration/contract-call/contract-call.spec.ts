import { RouteUrls } from '@shared/route-urls';

import { SendPage } from '../../page-objects/send-form.page';
import { WalletPage } from '../../page-objects/wallet.page';
import { BrowserDriver, createTestSelector, selectTestnet, setupBrowser } from '../utils';
import { SECRET_KEY_2 } from '@tests/mocks';
import { SettingsSelectors } from '@tests/integration/settings.selectors';
import { Page } from 'playwright-core';

jest.setTimeout(60_0000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe('Contract Call test', () => {
  const BEFORE_EACH_TIMEOUT = 600000;

  let browser: BrowserDriver;
  let walletPage: WalletPage;
  let mainPage: WalletPage;
  let sendForm: SendPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    walletPage = await WalletPage.init(browser, RouteUrls.Onboarding);
    await walletPage.signIn(SECRET_KEY_2);
    await walletPage.waitForHomePage();
    // switch to test net
    await selectTestnet(walletPage);

    // go to the previous page and click sign up again
    let pages = await WalletPage.getAllPages(browser);
    mainPage = new WalletPage(pages[1]);
    await mainPage.clickSignUp();

    await walletPage.page.waitForTimeout(2000);
    // select the first account from the testnet
    pages = await WalletPage.getAllPages(browser);
    let latestPage = pages[pages.length - 1];
    sendForm = new SendPage(latestPage);
    await sendForm.waitForPreview('$account1');
    await sendForm.clickFirstAccount();

    // go back to the main page and click contract call button
    await mainPage.clickContractCall();
    await walletPage.page.waitForTimeout(2000);
    // assign the context of latest page to the sendForm for further testing
    pages = await WalletPage.getAllPages(browser);
    latestPage = pages[pages.length - 1];
    sendForm = new SendPage(latestPage);
    await sendForm.waitForPreview('$standardFeeSelect');
  }, BEFORE_EACH_TIMEOUT);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('when fees is low', async () => {
    await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
    await sendForm.selectLowFeeOption();
    await sendForm.clickConfirmTransaction();
    await sendForm.page.isHidden(sendForm.getSelector('$standardFeeSelect'));
    await sendForm.page.close();
    const allPages = await WalletPage.getAllPages(browser);
    expect(allPages.length).toBe(3);
  });

  it('when fees is standard', async () => {
    await sendForm.clickConfirmTransaction();
    await sendForm.page.isHidden(sendForm.getSelector('$standardFeeSelect'));
    await sendForm.page.close();
    const allPages = await WalletPage.getAllPages(browser);
    expect(allPages.length).toBe(3);
  });

  it('when fees is high', async () => {
    await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
    await sendForm.selectHighFeeOption();
    await sendForm.clickConfirmTransaction();
    await sendForm.page.isHidden(sendForm.getSelector('$standardFeeSelect'));
    await sendForm.page.close();
    const allPages = await WalletPage.getAllPages(browser);
    expect(allPages.length).toBe(3);
  });

  it('when fees is custom', async () => {
    await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
    await sendForm.selectCustomFeeOption();
    await sendForm.inputFee('0.123456');
    const amountFee = await sendForm.getCustomFeeValue();
    expect(amountFee).toBe('0.123456');

    await sendForm.clickConfirmTransaction();
    await sendForm.page.isHidden(sendForm.getSelector('$standardFeeSelect'));
    await sendForm.page.close();
    const allPages = await WalletPage.getAllPages(browser);
    expect(allPages.length).toBe(3);
  });

  it('validates that custom fee has more than 6 decimal places', async () => {
    await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
    await sendForm.selectCustomFeeOption();
    await sendForm.inputFee('0.0000001');
    await sendForm.clickConfirmTransaction();
    const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$feeError'));
    const errorMessage = await errorMsgElement[0].innerText();
    expect(errorMessage).toEqual('STX can only have 6 decimals');
  });

  it('validates that custom fee must be positive', async () => {
    await sendForm.clickFeeEstimateSelect('$standardFeeSelect');
    await sendForm.selectCustomFeeOption();
    await sendForm.inputFee('-1');
    await sendForm.clickConfirmTransaction();
    const errorMsgElement = await sendForm.page.$$(sendForm.getSelector('$feeError'));
    const errorMessage = await errorMsgElement[0].innerText();
    expect(errorMessage).toEqual('Amount must be positive');
  });
});

describe('Wallet open', () => {
  const BEFORE_EACH_TIMEOUT = 600000;

  let browser: BrowserDriver;
  let walletPage: WalletPage;
  let mainPage: WalletPage;
  let sendForm: SendPage;
  let pages: Page[];
  let latestPage: Page;

  beforeEach(async () => {
    browser = await setupBrowser();
    walletPage = await WalletPage.init(browser, RouteUrls.Onboarding);
    await walletPage.signIn(SECRET_KEY_2);
    await walletPage.waitForHomePage();
    // switch to test net
    await selectTestnet(walletPage);
    pages = await WalletPage.getAllPages(browser);
    mainPage = new WalletPage(pages[1]);
    await mainPage.clickSignUp();

    await walletPage.page.waitForTimeout(2000);
    pages = await WalletPage.getAllPages(browser);
    latestPage = pages[pages.length - 1];
    sendForm = new SendPage(latestPage);
    await sendForm.waitForPreview('$account1');
    await sendForm.clickFirstAccount();
  }, BEFORE_EACH_TIMEOUT);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('when wallet is not locked', async () => {
    await mainPage.clickContractCall();
    await walletPage.page.waitForTimeout(2000);
    pages = await WalletPage.getAllPages(browser);
    latestPage = pages[pages.length - 1];
    sendForm = new SendPage(latestPage);
    await sendForm.waitForPreview('$standardFeeSelect');
    const isVisibleForm = await sendForm.page.isVisible(sendForm.getSelector('$standardFeeSelect'));
    expect(isVisibleForm).toBe(true);
  });

  it('when wallet is locked it shows unlock screen', async () => {
    await walletPage.clickSettingsButton();
    await walletPage.page.click(createTestSelector(SettingsSelectors.LockListItem));

    await mainPage.clickContractCall();
    await walletPage.page.waitForTimeout(2000);
    pages = await WalletPage.getAllPages(browser);
    latestPage = pages[pages.length - 1];
    sendForm = new SendPage(latestPage);
    await walletPage.page.waitForTimeout(4000);
    const isPasswordVisible = await sendForm.page.isVisible(mainPage.$passwordInput);
    expect(isPasswordVisible).toBe(true);
  });
});
