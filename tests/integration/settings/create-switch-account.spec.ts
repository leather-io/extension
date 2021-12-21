import { BrowserDriver, createTestSelector, setupBrowser } from '../utils';
import { WalletPage } from '../../page-objects/wallet.page';
import { RouteUrls } from '@shared/route-urls';
import { SettingsSelectors } from '@tests/integration/settings.selectors';
import { delay } from '@app/common/utils';

jest.setTimeout(60_000);

jest.retryTimes(process.env.CI ? 2 : 0);

describe(`Create and switch account`, () => {
  const numOfAccountsToTest = 3;
  let browser: BrowserDriver;
  let wallet: WalletPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    wallet = await WalletPage.init(browser, RouteUrls.Onboarding);
  }, 10000);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('should be able to create a new account then switch', async () => {
    await wallet.clickAllowAnalytics();
    await wallet.signUp();
    await wallet.clickSettingsButton();
    await wallet.page.click(wallet.$createAccountButton);
    await wallet.page.waitForSelector(wallet.$createAccountDone);
    await wallet.page.click(wallet.$createAccountDone);
    await delay(500);
    const displayName = await wallet.page.textContent(
      createTestSelector('home-current-display-name')
    );
    expect(displayName).toEqual('Account 2');
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector(SettingsSelectors.SwitchAccount));
    await wallet.page.click(createTestSelector('switch-account-item-0'));
    await wallet.page.waitForSelector(createTestSelector('account-checked-1'), { state: 'hidden' });
    await delay(500);
    const displayName2 = await wallet.page.textContent(
      createTestSelector('home-current-display-name')
    );
    expect(displayName2).toEqual('Account 1');
  });

  it(`should be able to create ${numOfAccountsToTest} new accounts then switch between them`, async () => {
    await wallet.clickAllowAnalytics();
    await wallet.signUp();
    for (let i = 0; i < numOfAccountsToTest - 1; i++) {
      await wallet.clickSettingsButton();
      await delay(100);
      await wallet.page.waitForSelector(wallet.$createAccountButton);
      await wallet.page.waitForSelector(createTestSelector(SettingsSelectors.ChangeNetworkAction));
      await wallet.page.click(wallet.$createAccountButton);
      await wallet.page.waitForSelector(wallet.$createAccountDone);
      await wallet.page.click(wallet.$createAccountDone);
    }

    for (let i = 0; i < numOfAccountsToTest; i++) {
      await wallet.clickSettingsButton();
      await wallet.page.click(createTestSelector(SettingsSelectors.SwitchAccount));
      await delay(500);
      await wallet.page.click(createTestSelector(`switch-account-item-${i}`));
      await wallet.page.waitForSelector(
        createTestSelector(`account-checked-${i - 1 + numOfAccountsToTest}`),
        { state: 'hidden' }
      );
      await delay(100);
      const displayName = await wallet.page.textContent(
        createTestSelector('home-current-display-name')
      );
      expect(displayName).toEqual(`Account ${i + 1}`);
    }
  });
});
