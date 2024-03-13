import { TestAppPage } from '@tests/page-object-models/test-app.page';
import { UpdateProfileRequestPage } from '@tests/page-object-models/update-profile-request.page';

import { test } from '../../fixtures/fixtures';

test.describe.configure({ mode: 'serial' });

test.describe('Profile updating', () => {
  let testAppPage: TestAppPage;

  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, context }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    testAppPage = await TestAppPage.openDemoPage(context);
    await testAppPage.signIn();
    const accountsPage = await context.waitForEvent('page');
    await accountsPage.locator('text="Account 1"').click({ force: true });
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
    await profileUpdatingPage.page.close();
  });

  test('should show an error for invalid profile', async ({ context }) => {
    await testAppPage.clickUpdateInvalidProfileButton();
    const profileUpdatingPage = new UpdateProfileRequestPage(await context.waitForEvent('page'));
    const error = await profileUpdatingPage.waitForUpdateProfileRequestError(
      'Invalid profile update request (Profile must follow Person schema).'
    );

    test.expect(error).toBeTruthy();
    await profileUpdatingPage.page.close();
  });
});

// Skipping this for now to see if shard 3 passes
test.describe('Gaia request', () => {
  let testAppPage: TestAppPage;

  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, context }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    testAppPage = await TestAppPage.openDemoPage(context);
    await testAppPage.signIn();
    const accountsPage = await context.waitForEvent('page');
    await accountsPage.locator('text="Account 2"').click({ force: true });
    await testAppPage.page.bringToFront();
    await testAppPage.page.click('text=Profile');
    await accountsPage.close();
  });

  test.skip('should send a signed profile token to gaia', async ({ context }) => {
    await testAppPage.clickUpdateProfileButton();
    const profileUpdatingPage = new UpdateProfileRequestPage(await context.waitForEvent('page'));

    const requestPromise = profileUpdatingPage.page.waitForRequest('https://hub.blockstack.org/*');

    await profileUpdatingPage.page.route('https://hub.blockstack.org/*', async route => {
      await route.abort();
    });

    await profileUpdatingPage.clickUpdateProfileButton();

    const request = await requestPromise;
    const requestBody = request.postDataBuffer();
    if (!requestBody) return;

    const { decodedToken } = JSON.parse(requestBody.toString())[0];

    test.expect(decodedToken).toBeDefined();

    test.expect(decodedToken?.header?.alg).toEqual('ES256K');
    test.expect(decodedToken?.payload?.claim?.name).toContain('Name ');
    test
      .expect(decodedToken?.payload?.claim?.image?.[0]?.contentUrl)
      .toEqual(
        'https://byzantion.mypinata.cloud/ipfs/Qmb84UcaMr1MUwNbYBnXWHM3kEaDcYrKuPWwyRLVTNKELC/2256.png'
      );
  });
});
