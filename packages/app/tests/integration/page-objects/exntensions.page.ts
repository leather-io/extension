import { Page } from 'playwright-core';
import { BrowserContext } from 'playwright-core';
import { WalletExtensionPage } from './wallet.extension.page';

export class ExtensionsPage {
  static url = 'chrome://extensions/';
  devModeBtn = '[id="devMode"]';
  extensionIDEl = '[id="extension-id"]';

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async init(context: BrowserContext) {
    const page = context.pages()[0];
    await page.goto(this.url);
    await page.bringToFront();
    return new this(page);
  }

  async openStacksWalletExtension() {
    await this.page.waitForSelector('text="Stacks Wallet"', { timeout: 10000 });
    await this.page.click(this.devModeBtn);
    const idText = (await this.page.$eval(this.extensionIDEl, el => el.textContent)) as string;
    const extensionID = idText.split(' ')[1];
    await this.page.goto(`chrome-extension://${extensionID}/index.html`);
    return new WalletExtensionPage(this.page);
  }
}
