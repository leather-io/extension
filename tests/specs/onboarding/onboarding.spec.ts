import { TEST_ACCOUNT_1_BTC_ADDRESS, TEST_ACCOUNT_1_STX_ADDRESS } from '@tests/mocks/constants';

import { test } from '../../fixtures/fixtures';

test.describe('onboarding existing user', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInExistingUser();
  });

  test('that restoring a wallet generates the correct bitcoin segwit address', async ({
    homePage,
  }) => {
    const testAddress = await homePage.getReceiveBtcAddress();
    test.expect(testAddress).toEqual(TEST_ACCOUNT_1_BTC_ADDRESS);
  });

  test('that restoring a wallet generates the correct stacks address', async ({ homePage }) => {
    const testAddress = await homePage.getReceiveStxAddress();
    test.expect(testAddress).toEqual(TEST_ACCOUNT_1_STX_ADDRESS);
  });
});
