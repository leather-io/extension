import { test } from '../../fixtures/fixtures';

test.describe('Receive Dialog', () => {
  test.beforeAll(async ({ extensionId, globalPage, onboardingPage, homePage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInExistingUser();
    await homePage.goToReceiveDialog();
  });

  test('That the Receive dialog renders and shows the correct assets', async ({ homePage }) => {
    test.expect(homePage.page.getByText('CHOOSE ASSET TO RECEIVE')).toBeTruthy();
    test.expect(homePage.page.getByText('Tokens')).toBeTruthy();
    test.expect(homePage.page.getByText('Collectibles')).toBeTruthy();

    test.expect(homePage.page.getByText('Bitcoin')).toBeTruthy();
    test.expect(homePage.page.getByText('Stacks')).toBeTruthy();
    test.expect(homePage.page.getByText('BRC-20')).toBeTruthy();
    test.expect(homePage.page.getByText('SRC-20')).toBeTruthy();
  });
});
