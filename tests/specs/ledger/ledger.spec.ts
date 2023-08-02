import { test } from '../../fixtures/fixtures';

test.describe('App with Ledger', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithLedgerAccount(extensionId);
  });

  test('that homepage renders correctly', async ({ homePage }) =>
    test.expect(homePage.page.locator('text="Next steps for you"')).toBeVisible());

  test('that receive modal opens', async ({ homePage }) => {
    const address = await homePage.getReceiveStxAddress();
    test.expect(address).toEqual('SPSDM5RXY2E3V7JTFYKPFNRPDHG1B85788FKG2KN');
  });

  test('that you can navigate to activity page', async ({ homePage }) => {
    await homePage.clickActivityTab();
    const noActivityText = homePage.page.getByText('No activity yet');
    // Account has activity to make sure we don't see label
    await test.expect(noActivityText).not.toBeVisible();
    test.expect(homePage.page.url()).toContain('/activity');
  });
});
