import { BrowserContext, Page } from 'playwright-core';
import { BrowserType, ChromiumBrowser } from 'playwright-core/types/types';
import { chromium } from 'playwright';
import path from 'path';

import { ExtensionsPage } from './page-objects/exntensions.page';
import { WalletExtensionPage } from './page-objects/wallet.extension.page';
import { randomString } from './utils';

const extPath: string = path.join(__dirname, '../../dist');
const tmpDir: string = path.join(__dirname, '../../dist/wallet-data');

const environments: [BrowserType<ChromiumBrowser>][] = [[chromium]];

jest.setTimeout(480000);
describe.each(environments)('wallet extension scenario - %s', browserType => {
  let browserContext: BrowserContext;
  let extensionsPage: ExtensionsPage;
  let walletExtPage: WalletExtensionPage;
  let backgroundPage: Page;

  beforeEach(async () => {
    browserContext = await browserType.launchPersistentContext(tmpDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${extPath}`,
        `--load-extension=${extPath}`,
      ],
    });
    backgroundPage = await browserContext.waitForEvent('backgroundpage');
    await backgroundPage.close();
    console.log(`[DEBUG]: Launched playwright browser: ${browserType.name()}`);
    extensionsPage = await ExtensionsPage.init(browserContext);
    walletExtPage = await extensionsPage.openStacksWalletExtension();
  }, 10000);

  afterEach(async () => {
    try {
      await browserContext.close();
    } catch (error) {
      console.error(error);
    }
  });

  it('should log in with secret key and unlock the account with password', async () => {
    await walletExtPage.clickSignUpBtn();
    const secretKey = await walletExtPage.getSecretKey();
    await walletExtPage.clickConfirmSavedBtn();
    await walletExtPage.setPassword(randomString(15));
    await walletExtPage.checkAccountFields();
    await walletExtPage.signOut();

    await walletExtPage.logInWithSecretKey(secretKey);
    const password = randomString(15);
    await walletExtPage.setPassword(password);
    await walletExtPage.lockAccount();
    await walletExtPage.unlockAccount(password);
    await walletExtPage.checkAccountFields();
  }, 90000);
});
