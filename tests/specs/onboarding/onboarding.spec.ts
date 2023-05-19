import {
  TEST_ACCOUNT_1_NATIVE_SEGWIT_ADDRESS,
  TEST_ACCOUNT_1_STX_ADDRESS,
  TEST_ACCOUNT_1_TAPROOT_ADDRESS,
} from '@tests/mocks/constants';
import { testAccountDefaultWalletState } from '@tests/page-object-models/onboarding.page';

import { test } from '../../fixtures/fixtures';

test.describe('Onboarding an existing user', () => {
  test('going through the onboarding flow to sign in', async ({
    extensionId,
    globalPage,
    onboardingPage,
    homePage,
  }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInExistingUser();
    await homePage.page.waitForTimeout(1000);

    const walletState = await onboardingPage.page.evaluate(async () =>
      window.debug.logPersistedStore()
    );

    // Deleting values that are known to differ at random
    delete (walletState as any).keys.entities.default.encryptedSecretKey;
    delete (walletState as any).keys.entities.default.salt;
    delete (testAccountDefaultWalletState as any).keys.entities.default.encryptedSecretKey;
    delete (testAccountDefaultWalletState as any).keys.entities.default.salt;

    test.expect(walletState).toEqual(testAccountDefaultWalletState);
  });

  test.describe('Address generation', () => {
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
});
