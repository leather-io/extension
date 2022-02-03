import { Page } from 'playwright-core';
import { createTestSelector } from '../integration/utils';
import { BuyTokensSelectors } from '@tests/page-objects/buy-tokens-selectors';

const selectors = {
  $btnBuyTokens: createTestSelector(BuyTokensSelectors.BtnBuyTokens),
  $btnTransak: createTestSelector(BuyTokensSelectors.BtnTransak),
  $btnOkCoin: createTestSelector(BuyTokensSelectors.BtnOkCoin),
};

export class BuyTokensPage {
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

  async waitForBtnTransak() {
    await this.page.waitForSelector(this.selectors.$btnTransak);
  }

  async clickBtnTransak() {
    await this.page.click(this.selectors.$btnTransak);
  }

  async waitForBtnOkCoin() {
    await this.page.waitForSelector(this.selectors.$btnOkCoin);
  }

  async clickBtnOkCoin() {
    await this.page.click(this.selectors.$btnOkCoin);
  }
}
