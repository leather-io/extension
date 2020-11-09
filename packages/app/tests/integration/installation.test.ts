import { environments, Browser, SECRET_KEY } from './utils';
import { InstallPage } from './page-objects/install.page';
import { BrowserContext } from 'playwright-core';

jest.retryTimes(process.env.CI ? 2 : 0);
jest.setTimeout(20_000);
describe.each(environments)('auth scenarios - %s %s', (browserType, deviceType) => {
  let browser: Browser;
  let context: BrowserContext;
  let installPage: InstallPage;
  let consoleLogs: any[];
  beforeEach(async () => {
    const launchArgs: string[] = [];
    if (browserType.name() === 'chromium') {
      launchArgs.push('--no-sandbox');
    }
    browser = await browserType.launch({
      args: launchArgs,
    });
    console.log('[DEBUG]: Launched puppeteer browser');
    if (deviceType) {
      context = await browser.newContext({
        viewport: deviceType.viewport,
        userAgent: deviceType.userAgent,
      });
    } else {
      context = await browser.newContext();
    }
    consoleLogs = [];
    installPage = await InstallPage.init(context);
    installPage.page.on('console', event => {
      consoleLogs = consoleLogs.concat(event.text());
    });
  }, 10000);

  afterEach(async () => {
    try {
      // console.log(consoleLogs);
      await browser.close();
    } catch (error) {
      // console.error(error);
    }
  });

  it('should be able to sign up from installation page', async () => {
    await installPage.clickSignUp();
    await installPage.waitForFinishedPage();
    const secretKey = await installPage.getSecretKey();
    expect(secretKey).not.toBeFalsy();
    expect(secretKey.split(' ').length).toEqual(12);
  });

  it('should be able to login from installation page', async () => {
    await installPage.clickSignIn();
    await installPage.loginWithPreviousSecretKey(SECRET_KEY);
    const secretKey = await installPage.getSecretKey();
    expect(secretKey).toEqual(SECRET_KEY);
  });
});
