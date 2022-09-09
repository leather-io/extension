import { BalanceSelectors } from '@tests-legacy/integration/balance.selectors';
import { BrowserDriver, createTestSelector, setupBrowser } from '@tests-legacy/integration/utils';
import { SECRET_KEY_2 } from '@tests-legacy/mocks';
import { WalletPage } from '@tests-legacy/page-objects/wallet.page';

import { RouteUrls } from '@shared/route-urls';

jest.setTimeout(60_000);
jest.retryTimes(process.env.CI ? 2 : 0);

const getAmount = (stxAmount: string) => (stxAmount ? parseFloat(stxAmount.replace(/,/g, '')) : 0);

describe(`balance integration tests`, () => {
  const BEFORE_ALL_TIMEOUT = 60000;
  let browser: BrowserDriver;
  let wallet: WalletPage;

  beforeAll(async () => {
    browser = await setupBrowser();
    wallet = await WalletPage.init(browser, RouteUrls.Onboarding);
    await wallet.signIn(SECRET_KEY_2);
  }, BEFORE_ALL_TIMEOUT);

  afterAll(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('checks Stacks Token balance is greater than 0', async () => {
    const stxAmount = await wallet.page.textContent(
      createTestSelector(BalanceSelectors.StacksToken)
    );
    const actualAmount = stxAmount && getAmount(stxAmount);
    expect(actualAmount).toBeGreaterThan(0);
  });
});
