import { Page } from '@playwright/test';
import { TEST_PASSWORD, TEST_SECRET_KEY } from '@tests/mocks/constants';
import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';

import { RouteUrls } from '@shared/route-urls';

export class OnboardingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async denyAnalytics() {
    await this.page.getByTestId(OnboardingSelectors.DenyAnalyticsBtn).click();
    await this.page.waitForURL('**' + RouteUrls.Onboarding);
  }

  async setPassword() {
    await this.page.waitForURL('**' + RouteUrls.SetPassword);
    await this.page.getByTestId(OnboardingSelectors.NewPasswordInput).fill(TEST_PASSWORD);
    await this.page.getByTestId(OnboardingSelectors.SetPasswordBtn).click();
  }

  async signUpNewUser() {
    await this.denyAnalytics();

    await this.page.getByTestId(OnboardingSelectors.SignUpBtn).click();
    await this.page.waitForURL('**' + RouteUrls.BackUpSecretKey);

    await this.page.getByTestId(OnboardingSelectors.BackUpSecretKeyBtn).click();
    await this.setPassword();
  }

  async signInExistingUser() {
    await this.denyAnalytics();

    await this.page.getByTestId(OnboardingSelectors.SignInLink).click();
    await this.page.getByTestId(OnboardingSelectors.SecretKeyInput).fill(TEST_SECRET_KEY);
    await this.page.getByTestId(OnboardingSelectors.SignInBtn).click();

    await this.setPassword();
    await this.page.waitForURL('**' + RouteUrls.Home);
    await this.page.getByTestId(HomePageSelectors.HomePageContainer).waitFor();
  }
}
