import { RouteUrls } from '@shared/route-urls';

import { WalletPage } from '@tests/page-objects/wallet.page';
import { addAPINetwork, BrowserDriver, setupBrowser } from '@tests/integration/utils';
import { SECRET_KEY_2 } from '@tests/mocks';
import { BuyTokensPage } from '@tests/page-objects/buy-tokens-page';

jest.setTimeout(60_0000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe('Buy tokens test', () => {
  const BEFORE_EACH_TIMEOUT = 600000;

  let browser: BrowserDriver;
  let walletPage: WalletPage;
  let buyTokensPage: BuyTokensPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    walletPage = await WalletPage.init(browser, RouteUrls.Onboarding);
    await walletPage.signIn(SECRET_KEY_2);
    await walletPage.waitForHomePage();
    await addAPINetwork(walletPage);
    await walletPage.goToBuyForm();
    buyTokensPage = new BuyTokensPage(walletPage.page);
  }, BEFORE_EACH_TIMEOUT);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  describe('Transak test', () => {
    it('click button should redirect to transak URL', async () => {
      await buyTokensPage.waitForBtnTransak();
      await buyTokensPage.clickBtnTransak();
      await buyTokensPage.page.waitForTimeout(2000);
      const allPages = await WalletPage.getAllPages(browser);
      const recentPage = allPages.pop();
      await recentPage?.waitForLoadState();
      const URL = await recentPage?.url();
      expect(URL).toContain('https://staging-global.transak.com');
    });
  });
});
