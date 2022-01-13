import { Page, BrowserContext } from 'playwright-core';
import { createTestSelector } from '../integration/utils';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';

export class DemoPage {
  static url = 'http://localhost:3000';
  openConnectBtn = createTestSelector(OnboardingSelectors.SignUpBtn);

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async init(context: BrowserContext) {
    const page = await context.newPage();
    await page.goto(this.url);
    return new this(page);
  }

  async openConnect() {
    return this.page.click(this.openConnectBtn, { timeout: 10000 });
  }
}
