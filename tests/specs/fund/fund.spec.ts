import { FundPageSelectors } from '@tests/selectors/fund.selectors';

import { test } from '../../fixtures/fixtures';

test.describe('Buy tokens test', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, homePage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.goToFundChooseCurrencyPage();
  });

  test('should redirect to provider URL while funding STX', async ({
    page,
    fundChooseCurrencyPage,
  }) => {
    await fundChooseCurrencyPage.goToFundStxPage();
    await test.expect(page.getByTestId(FundPageSelectors.FiatProviderName)).not.toHaveCount(0);

    const providerNames = await page.getByTestId(FundPageSelectors.FiatProviderName).all();
    const name = await providerNames[0].innerText();

    const providerItems = await page.getByTestId(FundPageSelectors.FiatProviderItem).all();
    await providerItems[0].click();

    await page.waitForTimeout(2000);
    const allPages = page.context().pages();
    const recentPage = allPages.pop();
    await recentPage?.waitForLoadState();
    const URL = recentPage?.url();
    test.expect(URL).toContain(name);
  });

  test('should redirect to provider URL while funding BTC', async ({
    page,
    fundChooseCurrencyPage,
  }) => {
    await fundChooseCurrencyPage.goToFundBtcPage();
    await test.expect(page.getByTestId(FundPageSelectors.FiatProviderName)).not.toHaveCount(0);

    const providerNames = await page.getByTestId(FundPageSelectors.FiatProviderName).all();
    const name = await providerNames[0].innerText();

    const providerItems = await page.getByTestId(FundPageSelectors.FiatProviderItem).all();
    await providerItems[0].click();

    await page.waitForTimeout(2000);
    const allPages = page.context().pages();
    const recentPage = allPages.pop();
    await recentPage?.waitForLoadState();
    const URL = recentPage?.url();
    test.expect(URL).toContain(name);
  });
});
