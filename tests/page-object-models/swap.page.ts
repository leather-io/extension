import { Locator, Page } from '@playwright/test';
import { SwapCryptoAssetSelectors } from '@tests/selectors/swap.selectors';

import { createTestSelector } from '@tests/utils';

export class SwapPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForSendPageReady() {
    await this.page.waitForSelector(createTestSelector(SwapCryptoAssetSelectors.SwapPageReady), {
      state: 'attached',
    });
  }
}
