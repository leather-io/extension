import { BrowserContext, Page } from '@playwright/test';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { TestAppSelectors } from '@tests/selectors/test-app.selectors';
import { createTestSelector } from '@tests/utils';

export class TestAppPage {
  static readonly url = 'http://localhost:3000';
  page: Page;
  readonly signInBtnSelector = createTestSelector(OnboardingSelectors.SignUpBtn);
  readonly contractCallBtnSelector = createTestSelector(TestAppSelectors.BtnContractCall);
  readonly stxTransferBtnSelector = createTestSelector(TestAppSelectors.BtnStxTransfer);
  readonly updateProfileBtnSelector = createTestSelector(TestAppSelectors.BtnUpdateValidProfile);
  readonly updateInvalidProfileBtnSelector = createTestSelector(
    TestAppSelectors.BtnUpdateInvalidProfile
  );

  constructor(page: Page) {
    this.page = page;
  }

  static async openDemoPage(context: BrowserContext) {
    const newPage = await context.newPage();
    await newPage.goto(TestAppPage.url);
    return new TestAppPage(newPage);
  }

  async signIn() {
    return this.page.click(this.signInBtnSelector, { timeout: 10000 });
  }

  async clickContractCallButton() {
    return this.page.click(this.contractCallBtnSelector);
  }

  async clickStxTransferButton() {
    return this.page.click(this.stxTransferBtnSelector);
  }

  async clickUpdateProfileButton() {
    return this.page.click(this.updateProfileBtnSelector);
  }

  async clickUpdateInvalidProfileButton() {
    return this.page.click(this.updateInvalidProfileBtnSelector);
  }
}
