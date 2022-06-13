import { BrowserDriver, createTestSelector, randomString, setupBrowser } from '../utils';
import { WalletPage } from '../../page-objects/wallet.page';
import { RouteUrls } from '@shared/route-urls';
import { SettingsSelectors } from '../settings.selectors';
import { delay } from '@app/common/utils';

jest.setTimeout(60_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe(`Settings integration tests`, () => {
  const numOfAccountsToTest = 3;
  let secretKey = '';
  let browser: BrowserDriver;
  let wallet: WalletPage;

  beforeAll(async () => {
    browser = await setupBrowser();
    wallet = await WalletPage.init(browser, RouteUrls.Onboarding);
    await wallet.signUp();
    await wallet.waitForHideOnboardingsStepsButton();
    await wallet.clickHideSteps();
    await delay(500);
  });

  afterAll(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('should be able to create a new account', async () => {
    await wallet.waitForSettingsButton();
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector(SettingsSelectors.CreateAccountBtn));
    await delay(500);
    await wallet.waitForHomePage();
    const displayName = await wallet.page.textContent(
      createTestSelector(SettingsSelectors.CurrentAccountDisplayName)
    );
    expect(displayName).toEqual('Account 2');
  });

  it(`should be able to create ${numOfAccountsToTest} new accounts then switch between them`, async () => {
    for (let i = 0; i < numOfAccountsToTest - 1; i++) {
      await wallet.waitForSettingsButton();
      await wallet.clickSettingsButton();
      await wallet.page.click(createTestSelector(SettingsSelectors.CreateAccountBtn));
      await delay(500);
      await wallet.waitForHomePage();
    }

    for (let i = 0; i < numOfAccountsToTest; i++) {
      await wallet.waitForSettingsButton();
      await wallet.clickSettingsButton();
      await wallet.page.click(createTestSelector(SettingsSelectors.SwitchAccount));
      await delay(500);
      await wallet.page.click(createTestSelector(`switch-account-item-${i}`));
      await wallet.page.waitForSelector(
        createTestSelector(`account-checked-${i - 1 + numOfAccountsToTest}`),
        { state: 'hidden' }
      );
      await delay(500);
      await wallet.waitForHomePage();
      const displayName = await wallet.page.textContent(
        createTestSelector(SettingsSelectors.CurrentAccountDisplayName)
      );
      expect(displayName).toEqual(`Account ${i + 1}`);
    }
  });

  it('should be able to view and save secret key to clipboard', async () => {
    await wallet.goToSecretKey();
    await wallet.waitForEnterPasswordInput();
    await wallet.enterPasswordAndUnlockWallet();
    secretKey = await wallet.getSecretKey();
    await wallet.page.click(createTestSelector(SettingsSelectors.CopyKeyToClipboardBtn));
    const copySuccessMessage = await wallet.page.textContent(
      createTestSelector(SettingsSelectors.CopyKeyToClipboardBtn)
    );
    expect(copySuccessMessage).toContain('Copied!');
  });

  it('should be able to sign out, lock and unlock the extension', async () => {
    await wallet.waitForSettingsButton();
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector(SettingsSelectors.SignOutListItem));
    await wallet.page.click(wallet.$signOutConfirmHasBackupCheckbox);
    await wallet.page.click(wallet.$signOutDeleteWalletBtn);
    await wallet.clickSignIn();
    await wallet.enterSecretKey(secretKey);
    const password = randomString(15);
    await wallet.enterNewPassword(password);
    await wallet.clickSkipFundAccountButton();
    await wallet.waitForSettingsButton();
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector(SettingsSelectors.LockListItem));
    await wallet.enterPasswordAndUnlockWallet(password);
    const displayName = await wallet.page.textContent(
      createTestSelector(SettingsSelectors.CurrentAccountDisplayName)
    );
    expect(displayName).toEqual('Account 1');
  });

  it('should be able to change network', async () => {
    await wallet.waitForSettingsButton();
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
    expect(networkListItems).toHaveLength(3);
  });
});
