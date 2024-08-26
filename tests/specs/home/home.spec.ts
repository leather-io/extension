import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors.js';

import { test } from '../../fixtures/fixtures';

test.describe('Home', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
  });

  test('that clicking the hide button hides account balance', async ({ homePage }) => {
    const visibleBalanceText = await homePage.page
      .getByTestId(SharedComponentsSelectors.AccountCardBalanceText)
      .textContent();
    test.expect(visibleBalanceText).toBeTruthy();

    await homePage.page
      .getByTestId(SharedComponentsSelectors.AccountCardToggleHideBalanceBtn)
      .click();

    // just checks that the balance text changed (don't care about the implementation)
    await test
      .expect(homePage.page.getByTestId(SharedComponentsSelectors.AccountCardBalanceText))
      .not.toHaveText(visibleBalanceText!);

    await homePage.page
      .getByTestId(SharedComponentsSelectors.AccountCardToggleHideBalanceBtn)
      .click();

    await test
      .expect(homePage.page.getByTestId(SharedComponentsSelectors.AccountCardBalanceText))
      .toHaveText(visibleBalanceText!);
  });
});
