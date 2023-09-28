import { Page } from '@playwright/test';
import { TestAppPage } from '@tests/page-object-models/test-app.page';
import { UpdateProfileRequestPage } from '@tests/page-object-models/update-profile-request.page';

import { test } from '../../fixtures/fixtures';

test.describe.configure({ mode: 'serial' });

test.describe('Profile updating', () => {
  let testAppPage: TestAppPage;

  function interceptGaiaRequest(page: Page): Promise<Buffer> {
    return new Promise(resolve => {
      page.on('request', request => {
        if (request.url().startsWith('https://hub.blockstack.org/store')) {
          const requestBody = request.postDataBuffer();
          if (request.method() === 'GET') return;
          if (requestBody === null) return;
          resolve(requestBody);
        }
      });
    });
  }

  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, context }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    testAppPage = await TestAppPage.openDemoPage(context);
    await testAppPage.signIn();
    const accountsPage = await context.waitForEvent('page');
    await accountsPage.locator('text="Account 1"').click();
    await testAppPage.page.bringToFront();
    await testAppPage.page.click('text=Profile');
    await accountsPage.close();
  });

  test('should show profile details', async ({ context }) => {
    await testAppPage.clickUpdateProfileButton();
    const profileUpdatingPage = new UpdateProfileRequestPage(await context.waitForEvent('page'));
    const name = profileUpdatingPage.page.getByText('twitter');
    const nameText = await name.innerText();

    test.expect(nameText).toBe('https://twitter.com/twitterHandle');
  });

  test('should show an error for invalid profile', async ({ context }) => {
    await testAppPage.clickUpdateInvalidProfileButton();
    const profileUpdatingPage = new UpdateProfileRequestPage(await context.waitForEvent('page'));
    const error = await profileUpdatingPage.waitForUpdateProfileRequestError(
      'Invalid profile update request (Profile must follow Person schema).'
    );

    test.expect(error).toBeTruthy();
  });

  test('should send a signed profile token to gaia', async ({ context }) => {
    await testAppPage.clickUpdateProfileButton();
    const profileUpdatingPage = new UpdateProfileRequestPage(await context.waitForEvent('page'));

    const [gaiaRequestBody] = await Promise.all([
      interceptGaiaRequest(profileUpdatingPage.page),
      profileUpdatingPage.clickUpdateProfileButton(),
    ]);

    const { decodedToken } = JSON.parse(gaiaRequestBody.toString())[0];

    test.expect(decodedToken?.header?.alg).toEqual('ES256K');
    test.expect(decodedToken?.payload?.claim?.name).toContain('Name ');
    test
      .expect(decodedToken?.payload?.claim?.image?.[0]?.contentUrl)
      .toEqual(
        'https://byzantion.mypinata.cloud/ipfs/Qmb84UcaMr1MUwNbYBnXWHM3kEaDcYrKuPWwyRLVTNKELC/2256.png'
      );
  });
});
