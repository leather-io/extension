import { BrowserDriver, createTestSelector, setupBrowser } from '@tests/integration/utils';
import { WalletPage } from '@tests/page-objects/wallet.page';
import { RouteUrls } from '@shared/route-urls';
import { BalanceSelectors } from '@tests/integration/balance.selectors';
import { SECRET_KEY_2 } from '@tests/mocks';

jest.setTimeout(60_000);
jest.retryTimes(process.env.CI ? 2 : 0);

const getAmount = (stxAmount: string) => {
  return stxAmount ? parseFloat(stxAmount.replace(/,/g, '')) : 0;
};

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
