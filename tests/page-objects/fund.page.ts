import { Page } from 'playwright-core';

import { FundPageSelectors } from '@tests/page-objects/fund.selectors';

import { createTestSelector } from '../integration/utils';

const selectors = {
  $fiatProviderItem: createTestSelector(FundPageSelectors.FiatProviderItem),
};

export class FundPage {
  selectors = selectors;
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async select(selector: keyof typeof selectors) {
    return this.page.$(selectors[selector]);
  }

  getSelector(selector: keyof typeof selectors) {
    return this.selectors[selector];
  }

  async waitForFiatProviderItem() {
    await this.page.waitForSelector(this.selectors.$fiatProviderItem);
  }

  async clickMoonPayProviderItem() {
    const providers = await this.page.$$(this.selectors.$fiatProviderItem);
    await providers[0].click();
  }
}
