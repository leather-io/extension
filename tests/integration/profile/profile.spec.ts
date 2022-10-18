import { Page } from 'playwright';
import { WalletPage } from '@tests/page-objects/wallet.page';
import { DemoPage } from '@tests/page-objects/demo.page';
import { RouteUrls } from '@shared/route-urls';
import { BrowserDriver, createTestSelector, getCurrentTestName, setupBrowser } from '../utils';
import { ProfileUpdatingSelectors } from '@tests/integration/profile/profile-updating.selector';
import { ProfileUpdatingPage } from '@tests/page-objects/profile-updating.page';
import exp from 'constants';

jest.setTimeout(120_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe(`Profile updating`, () => {
  let browser: BrowserDriver;
  let wallet: WalletPage;
  let demo: DemoPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    await browser.context.tracing.start({ screenshots: true, snapshots: true });
    wallet = await WalletPage.init(browser, RouteUrls.Onboarding);
    demo = browser.demo;
  });

  afterEach(async () => {
    try {
      await browser.context.tracing.stop({
        path: `trace-${getCurrentTestName()}.trace.zip`,
      });
      await browser.context.close();
    } catch (error) {
      console.log(error);
    }
  });

  describe('New created wallet scenarios', () => {
    let profileUpdatingPage: ProfileUpdatingPage;

    function interceptGaiaRequest(page: Page): Promise<Buffer> {
      return new Promise(resolve => {
        page.on('request', request => {
          if (request.url().startsWith('https://hub.blockstack.org/store')) {
            const requestBody = request.postDataBuffer();
            if (request.method() === 'GET') return;
            console.log(request.method());
            if (requestBody === null) return;
            console.log(requestBody.toString());
            resolve(requestBody);
          }
        });
      });
    }

    beforeEach(async () => {
      await wallet.signUp();
      await demo.page.reload();
      const [popup] = await Promise.all([
        browser.context.waitForEvent('page'),
        browser.demo.openConnect(),
      ]);
      const [response] = await Promise.all([
        popup.waitForNavigation(),
        popup.click(createTestSelector('account-account-1-0')),
      ]);
      if (response) console.log(response);
      await wallet.page.close();
      await demo.page.bringToFront();
      const [page] = await Promise.all([
        browser.context.waitForEvent('page'),
        demo.page.click('text=Profile'),
        demo.page.click(createTestSelector(ProfileUpdatingSelectors.BtnUpdateProfile)),
      ]);
      profileUpdatingPage = new ProfileUpdatingPage(page);
    });

    it('should show profile details', async () => {
      const name = await profileUpdatingPage.page.textContent(
        createTestSelector(ProfileUpdatingSelectors.ProfileName)
      );
      expect(name).toContain('Name ');
    });

    it('should send a signed profile token to gaia', async () => {
      const [gaiaRequestBody] = await Promise.all([
        interceptGaiaRequest(profileUpdatingPage.page),
        profileUpdatingPage.page
          .locator(createTestSelector(ProfileUpdatingSelectors.BtnUpdateProfile))
          .click(),
      ]);
      const { decodedToken } = JSON.parse(gaiaRequestBody.toString())[0];
      console.log(decodedToken);
      expect(decodedToken?.header?.alg).toEqual('ES256K');
      expect(decodedToken?.payload?.claim?.name).toContain('Name ');
      
      expect(decodedToken?.payload?.claim?.avatarUrl).toEqual(
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' fill='red' /%3E%3C/svg%3E"
      );
      
    });
  });
});
