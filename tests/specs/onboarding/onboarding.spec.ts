import {
  TEST_ACCOUNT_1_NATIVE_SEGWIT_ADDRESS,
  TEST_ACCOUNT_1_STX_ADDRESS,
  TEST_ACCOUNT_1_TAPROOT_ADDRESS,
} from '@tests/mocks/constants';

import { test } from '../../fixtures/fixtures';

test.describe('onboarding existing user', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInExistingUser();
  });

  test.describe('Bitcoin', () => {
    test('that the wallet generates the correct Native Segwit address', async ({ homePage }) => {
      const nativeSegwitAddress = await homePage.getReceiveNativeSegwitAddress();
      test.expect(nativeSegwitAddress).toEqual(TEST_ACCOUNT_1_NATIVE_SEGWIT_ADDRESS);
    });

    test('that the wallet generates the correct Taproot address', async ({ homePage }) => {
      const taprootAddress = await homePage.getReceiveTaprootAddress();
      test.expect(taprootAddress).toEqual(TEST_ACCOUNT_1_TAPROOT_ADDRESS);
    });
  });

  test.describe('Stacks', () => {
    test('that restoring a wallet generates the correct stacks address', async ({ homePage }) => {
      const stacksAddress = await homePage.getReceiveStxAddress();
      test.expect(stacksAddress).toEqual(TEST_ACCOUNT_1_STX_ADDRESS);
    });
  });
});
