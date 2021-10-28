import { BrowserDriver, createTestSelector, setupBrowser } from '../utils';
import { WalletPage } from '../../page-objects/wallet.page';
import { ScreenPaths } from '@common/types';
import { SettingsSelectors } from '../settings.selectors';

jest.setTimeout(30_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe(`Lock screen tests`, () => {
  const BEFORE_ALL_TIMEOUT = 20000;
  let browser: BrowserDriver;
  let wallet: WalletPage;

  beforeAll(async () => {
    browser = await setupBrowser();
    wallet = await WalletPage.init(browser, ScreenPaths.INSTALLED);
    await wallet.signUp();
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector(SettingsSelectors.LockListItem));
    await wallet.waitForSetPassword();
  }, BEFORE_ALL_TIMEOUT);

  afterAll(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('should be able to lock the wallet', async () => {
    const lockScreen = await wallet.page.isVisible(
      createTestSelector(SettingsSelectors.SetPassword)
    );
    expect(lockScreen).toBeTruthy();
  });

  it('should be able to unlock the wallet', async () => {
    const lockScreen = await wallet.page.isVisible(
      createTestSelector(SettingsSelectors.SetPassword)
    );
    expect(lockScreen).toBeTruthy();
    await wallet.enterPassword();
    await wallet.waitForHomePage();
    const homeScreen = await wallet.page.isVisible(createTestSelector('home-page'));
    expect(homeScreen).toBeTruthy();
  });
});
