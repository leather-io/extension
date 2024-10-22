import { Locator, Page } from '@playwright/test';

import { RouteUrls } from '@shared/route-urls';

export class FundChooseCurrencyPage {
  readonly page: Page;
  readonly stxButton: Locator;
  readonly btcButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.stxButton = page.getByTestId('STX');
    this.btcButton = page.getByTestId('BTC');
  }

  async goToFundBtcPage() {
    await this.page.waitForURL('**' + RouteUrls.FundChooseCurrency);
    await this.btcButton.click();
    await this.page.waitForURL('**' + RouteUrls.Fund.replace(':currency', 'BTC'));
  }
  async goToFundStxPage() {
    await this.page.waitForURL('**' + RouteUrls.FundChooseCurrency);
    await this.stxButton.click();
    await this.page.waitForURL('**' + RouteUrls.Fund.replace(':currency', 'STX'));
  }
}
