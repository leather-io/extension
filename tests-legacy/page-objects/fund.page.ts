import { Page } from '@playwright/test';
import { FundPageSelectors } from '@tests-legacy/page-objects/fund.selectors';

import { createTestSelector } from '../integration/utils';

const selectors = {
  $fiatProviderItem: createTestSelector(FundPageSelectors.FiatProviderItem),
  $fiatProviderName: createTestSelector(FundPageSelectors.FiatProviderName),
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

  async clickFirstFastCheckoutProviderItem() {
    const providers = await this.page.$$(this.selectors.$fiatProviderItem);
    await providers[0].click();
  }

  async getFirstFastCheckoutProviderName() {
    const providerNames = await this.page.$$(this.selectors.$fiatProviderName);
    const firstFastCheckoutProviderName = providerNames[0].innerText();
    return firstFastCheckoutProviderName;
  }
}
