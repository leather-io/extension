import { SettingsSelectors } from '@tests-legacy/integration/settings.selectors';
import { SECRET_KEY_2 } from '@tests-legacy/mocks';
import { Page } from 'playwright-core';

import { RouteUrls } from '@shared/route-urls';

import { SendPage } from '../../page-objects/send-form.page';
import { WalletPage } from '../../page-objects/wallet.page';
import { BrowserDriver, createTestSelector, selectTestnet, setupBrowser } from '../utils';

jest.setTimeout(60_0000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe('Locked wallet test', () => {
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
    await mainPage.page.waitForTimeout(5_000);
  }, BEFORE_EACH_TIMEOUT);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('should show unlock page when wallet is locked', async () => {
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

  it('should show send form when wallet is not locked', async () => {
    await mainPage.clickContractCall();
    await walletPage.page.waitForTimeout(2000);
    pages = await WalletPage.getAllPages(browser);
    latestPage = pages[pages.length - 1];
    sendForm = new SendPage(latestPage);
    await sendForm.waitForPreview('$standardFeeSelect');
    const isVisibleForm = await sendForm.page.isVisible(sendForm.getSelector('$standardFeeSelect'));
    expect(isVisibleForm).toBe(true);
  });
});
