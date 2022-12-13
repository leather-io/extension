import { OnboardingSelectors } from '@tests-legacy/integration/onboarding/onboarding.selectors';
import { SettingsSelectors } from '@tests-legacy/integration/settings.selectors';
import { FundPageSelectors } from '@tests-legacy/page-objects/fund.selectors';

import { RouteUrls } from '@shared/route-urls';

import { test } from './utils/testfn';

test('get support menu item takes user to support page', async ({ page, extensionId }) => {
  await page.route(/.*/, route => route.abort());
  await page.route(/chrome-extension/, route => route.continue());

  await page.goto(`chrome-extension://${extensionId}/index.html`);

  await page.getByTestId(OnboardingSelectors.AnalyticsDenyBtn).click();
  await page.waitForURL('**' + RouteUrls.Onboarding);

  await page.getByTestId(OnboardingSelectors.SignUpBtn).click();
  await page.waitForURL('**' + RouteUrls.BackUpSecretKey);

  await page.getByTestId(OnboardingSelectors.BackUpSecretKeyBtn).click();
  await page.waitForURL('**' + RouteUrls.SetPassword);

  await page.getByTestId(OnboardingSelectors.NewPasswordInput).fill('my_s3cret_p@ssw0r4');
  await page.getByTestId(OnboardingSelectors.SetPasswordBtn).click();
  await page.waitForURL('**' + RouteUrls.Home);

  await page.getByTestId(FundPageSelectors.BtnSkipFundAccount).click();
  await page.getByTestId(SettingsSelectors.MenuBtn).click();

  const [supportPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByTestId(SettingsSelectors.GetSupport).click(),
  ]);

  await test
    .expect(supportPage)
    .toHaveURL('https://wallet.hiro.so/wallet-faq/where-can-i-find-support-for-the-stacks-wallet');
});
