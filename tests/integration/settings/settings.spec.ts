import { BrowserDriver, createTestSelector, randomString, setupBrowser } from '../utils';
import { WalletPage } from '../../page-objects/wallet.page';
import { RouteUrls } from '@shared/route-urls';
import { SettingsSelectors } from '../settings.selectors';
import { delay } from '@app/common/utils';

jest.setTimeout(60_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe(`Settings integration tests`, () => {
  let browser: BrowserDriver;
  let wallet: WalletPage;

  beforeAll(async () => {
    browser = await setupBrowser();
    wallet = await WalletPage.init(browser, RouteUrls.Onboarding);
    await wallet.clickAllowAnalytics();
    await wallet.signUp();
  });

  afterAll(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('should be able to create a new account', async () => {
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector(SettingsSelectors.BtnCreateAccount));
    await wallet.page.click(createTestSelector(SettingsSelectors.BtnCreateAccountDone));
    await delay(500);
    const displayName = await wallet.page.textContent(
      createTestSelector(SettingsSelectors.HomeCurrentAccountDisplayName)
    );
    expect(displayName).toEqual('Account 2');
  });

  it('should be able to view and save secret key to clipboard', async () => {
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector(SettingsSelectors.ViewSecretKeyListItem));
    await wallet.page.click(createTestSelector(SettingsSelectors.BtnCopyKeyToClipboard));
    const copySuccessMessage = await wallet.page.textContent(
      createTestSelector(SettingsSelectors.BtnCopyKeyToClipboard)
    );
    expect(copySuccessMessage).toContain('Copied!');
  });

  it('should be able to sign out, lock and unlock the extension', async () => {
    const secretKey = await wallet.getSecretKey();
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector(SettingsSelectors.SignOutListItem));
    await wallet.page.click(wallet.$signOutConfirmHasBackupCheckbox);
    await wallet.page.click(wallet.$signOutDeleteWalletBtn);
    await wallet.clickSignIn();
    await wallet.enterSecretKey(secretKey);
    const password = randomString(15);
    await wallet.enterPassword(password);
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector(SettingsSelectors.LockListItem));
    await wallet.enterPassword(password);
    const displayName = await wallet.page.textContent(
      createTestSelector(SettingsSelectors.HomeCurrentAccountDisplayName)
    );
    expect(displayName).toEqual('Account 1');
  });

  it('should be able to change network', async () => {
    await wallet.clickSettingsButton();
    const currentNetwork = await wallet.page.textContent(
      createTestSelector(SettingsSelectors.CurrentNetwork)
    );
    expect(currentNetwork).toContain('mainnet');
    await wallet.page.click(createTestSelector(SettingsSelectors.ChangeNetworkAction));
    await wallet.page.waitForTimeout(850);
    const networkListItems = await wallet.page.$$(
      createTestSelector(SettingsSelectors.NetworkListItem)
    );
    expect(networkListItems).toHaveLength(4);
  });
});
