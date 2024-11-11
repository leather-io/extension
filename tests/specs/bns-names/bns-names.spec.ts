import { mockBnsV2NamesRequest } from '@tests/mocks/mock-stacks-bns';
import { getSwitchAccountSheetAccountNameSelector } from '@tests/selectors/account.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { test } from '../../fixtures/fixtures';

const ACCOUNT_ONE_NAME = 'leather.btc';

test.describe('Bns v2 names', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await mockBnsV2NamesRequest(globalPage.page);
    await onboardingPage.signInWithTestAccount(extensionId);
  });

  test('that correctly shows bns v2 account name', async ({ page }) => {
    const accountName = page.getByTestId(SettingsSelectors.CurrentAccountDisplayName);

    const accountNameText = await accountName.innerText();
    test.expect(accountNameText).toEqual(ACCOUNT_ONE_NAME);
    await accountName.click();

    const accountOneName = page.getByTestId(getSwitchAccountSheetAccountNameSelector(0));
    const accountOneNameText = await accountOneName.innerText();

    test.expect(accountOneNameText).toEqual(ACCOUNT_ONE_NAME);
  });
});
