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
    await this.page.waitForTimeout(1500);
    await this.gotoNakedRoot(extensionId);
  }

  async setupAndUseMockedApiCalls(extensionId: string) {
    await this.page.route(/.*/, route => route.abort());
    await setupMockApis(this.page);
    await this.gotoNakedRoot(extensionId);
  }
}
