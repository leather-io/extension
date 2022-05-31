import { RouteUrls } from '@shared/route-urls';

import { WalletPage } from '../../page-objects/wallet.page';
import { BrowserDriver, setupBrowser } from '../utils';
import { SECRET_KEY_2 } from '@tests/mocks';
import { FundPage } from '@tests/page-objects/fund.page';

jest.setTimeout(60_0000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe('Buy tokens test', () => {
  const BEFORE_EACH_TIMEOUT = 600000;

  let browser: BrowserDriver;
  let walletPage: WalletPage;
  let fundPage: FundPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    walletPage = await WalletPage.init(browser, RouteUrls.Onboarding);
    await walletPage.signIn(SECRET_KEY_2);
    await walletPage.goToFundPage();
    fundPage = new FundPage(walletPage.page);
  }, BEFORE_EACH_TIMEOUT);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  describe('Fiat provider', () => {
    it('should redirect to provider URL', async () => {
      await fundPage.waitForFiatProviderItem();
      await fundPage.clickMoonPayProviderItem();
      await fundPage.page.waitForTimeout(2000);
      const allPages = await WalletPage.getAllPages(browser);
      const recentPage = allPages.pop();
      await recentPage?.waitForLoadState();
      const URL = recentPage?.url();
      expect(URL).toContain('https://buy.moonpay.com');
    });
  });
});
