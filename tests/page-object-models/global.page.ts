import { Page } from '@playwright/test';
import { setupMockApis } from '@tests/mocks/mock-apis';

export class GlobalPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoNakedRoot(extensionId: string) {
    await this.page.goto(`chrome-extension://${extensionId}/index.html`);
  }

  async setupAndUseApiCalls(extensionId: string) {
    await this.page.route(/.*/, route => route.continue());
    await setupMockApis(this.page);
    await this.page.waitForTimeout(600);
    await this.gotoNakedRoot(extensionId);
    // I've no idea why this delay is needed. Was required when switching to MV3. Without it,
    // this error is thrown. Let's try removing with later versions of Playwright.
    //
    // Error: page.goto: Navigation failed because page was closed!
    // =========================== logs ===========================
    // navigating to "chrome-extension://bcokkkbghbnpbjpkoifjakaofdjfgeaj/index.html", waiting until "load"
    // ============================================================
    // await this.page.goto(`chrome-extension://${extensionId}/index.html`);
  }

  async setupAndUseMockedApiCalls(extensionId: string) {
    await this.page.route(/.*/, route => route.abort());
    await setupMockApis(this.page);
    await this.gotoNakedRoot(extensionId);
  }
}
