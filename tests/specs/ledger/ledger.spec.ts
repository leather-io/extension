import { TEST_ACCOUNT_1_STX_ADDRESS, TEST_ACCOUNT_2_STX_ADDRESS } from '@tests/mocks/constants';
import { mockMainnetTestAccountStacksConfirmedTxsRequests } from '@tests/mocks/mock-stacks-txs';
import type { HomePage } from '@tests/page-object-models/home.page';
import { makeLedgerTestAccountWalletState } from '@tests/page-object-models/onboarding.page';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { test } from '../../fixtures/fixtures';

const specs = {
  withBitcoinAndStacksKey: makeLedgerTestAccountWalletState(['bitcoin', 'stacks']),
  withStacksKeysOnly: makeLedgerTestAccountWalletState(['stacks']),
  withBitcoinKeysOnly: makeLedgerTestAccountWalletState(['bitcoin']),
};

async function interceptBitcoinRequests(homePage: HomePage) {
  const requestPromise = homePage.page.waitForRequest(/bestinslot|mempool\.space|inscriptions/, {
    timeout: 1000,
  });
  return requestPromise;
}

test.describe('App with Ledger', () => {
  for (const [testName, state] of Object.entries(specs)) {
    test.describe(testName, () => {
      test.beforeEach(async ({ extensionId, globalPage, onboardingPage }) => {
        await globalPage.setupAndUseApiCalls(extensionId);
        await onboardingPage.signInWithLedgerAccount(extensionId, state);
        await mockMainnetTestAccountStacksConfirmedTxsRequests(globalPage.page);
      });

      test('that homepage renders correctly', async ({ homePage }) => {
        await test.expect(homePage.page.locator('text="Send"').first()).toBeVisible();
        await test.expect(homePage.page.locator('text="Receive"').first()).toBeVisible();
        await test.expect(homePage.page.locator('text="Buy"').first()).toBeVisible();
      });

      test('receive modal opens', async ({ homePage }) => {
        await homePage.goToReceiveDialog();
        test.expect(homePage.page.url()).toContain('/receive');
      });

      if (testName === 'withStacksKeysOnly') {
        test('stacks address is shown by default', async ({ homePage }) => {
          const stacksAddress = await homePage.getReceiveStxAddress();
          test.expect(stacksAddress).toEqual(TEST_ACCOUNT_1_STX_ADDRESS);
        });

        test('there are no bitcoin requests', async ({ homePage }) => {
          const requestPromise = interceptBitcoinRequests(homePage);

          await homePage.page.getByTestId(SettingsSelectors.CurrentAccountDisplayName).click();

          await test
            .expect(async () => await test.expect(requestPromise).rejects.toThrowError())
            .toPass()
            .catch();
        });

        test('that you can switch accounts', async ({ homePage }) => {
          await homePage.switchAccount(1);
          const stacksAddress = await homePage.getReceiveStxAddress();
          test.expect(stacksAddress).toEqual(TEST_ACCOUNT_2_STX_ADDRESS);
        });
      }

      test('that you can navigate to activity page', async ({ homePage }) => {
        await homePage.clickActivityTab();
        const noActivityText = homePage.page.getByText('No activity yet');
        // Account has activity to make sure we don't see label
        await test.expect(noActivityText).not.toBeVisible();
        test.expect(homePage.page.url()).toContain('/activity');
      });
    });
  }
});
