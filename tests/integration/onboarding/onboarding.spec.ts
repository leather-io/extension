import { BrowserDriver, createTestSelector, setupBrowser } from '../utils';
import { SECRET_KEY } from '../../mocks';
import { WalletPage } from '../../page-objects/wallet.page';
import { SettingsSelectors } from '../settings.selectors';
import { RouteUrls } from '@shared/route-urls';

jest.setTimeout(30_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe(`Onboarding integration tests`, () => {
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

  it('should be able to sign up from welcome page', async () => {
    await wallet.clickAllowAnalytics();
    await wallet.clickSignUp();
    await wallet.saveKey();
    await wallet.waitForHomePage();
    await wallet.goToSecretKey();
    const secretKey = await wallet.getSecretKey();
    expect(secretKey).not.toBeFalsy();
    expect(secretKey.split(' ').length).toEqual(24);
  });

  it('should be able to login from welcome page then logout', async () => {
    await wallet.clickAllowAnalytics();
    await wallet.clickSignIn();
    await wallet.loginWithPreviousSecretKey(SECRET_KEY);
    await wallet.waitForHomePage();
    const secretKey = await wallet.getSecretKey();
    expect(secretKey).toEqual(SECRET_KEY);
    await wallet.clickSettingsButton();
    const signoutBtn = await wallet.page.$('text=Sign Out');
    expect(signoutBtn).toBeTruthy();
    await wallet.page.click('text=Sign Out');
    await wallet.page.click(wallet.$signOutConfirmHasBackupCheckbox);
    await wallet.page.click(wallet.$signOutDeleteWalletBtn);
    await wallet.waitForLoginPage();
  });

  it('should route to unlock page if the wallet is locked', async () => {
    await wallet.clickAllowAnalytics();
    await wallet.clickSignUp();
    await wallet.saveKey();
    await wallet.waitForHomePage();
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector(SettingsSelectors.LockListItem));
    await wallet.waitForHiroWalletLogo();
    await wallet.page.click(wallet.$hiroWalletLogo);
    await wallet.waitForSetOrEnterPasswordInput();
  });
});
