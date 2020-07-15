import { Page } from 'playwright-core';
import { createTestSelector, wait, Browser } from '../utils';

export class TxPage {
  static url = 'http://localhost:8080';
  page: Page;
  $confirmTxButton = createTestSelector('confirm-tx-button');

  constructor(page: Page) {
    this.page = page;
  }

  static async getTxPage(browser: Browser) {
    const page = await this.recursiveGetTxPage(browser);
    if (!page) {
      throw new Error('Unable to get auth page popup');
    }
    const txPage = new this(page);
    await page.waitForSelector(createTestSelector('screen'));
    return txPage;
  }

  /**
   * Due to flakiness of getting the pop-up page, this has some 'retry' logic
   */
  static async recursiveGetTxPage(browser: Browser, attempt = 1): Promise<Page> {
    const page = browser.contexts()[0].pages()[1];
    if (!page) {
      if (attempt > 3) {
        throw new Error('Unable to get auth page popup');
      }
      await wait(50);
      return this.recursiveGetTxPage(browser, attempt + 1);
    }
    return page;
  }
}
