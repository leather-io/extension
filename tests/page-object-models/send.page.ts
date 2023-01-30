import { Page } from '@playwright/test';
import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { RouteUrls } from '@shared/route-urls';

export class SendPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectStxAndGoToSendForm() {
    await this.page.waitForURL('**' + RouteUrls.SendCryptoAsset);
    await this.page
      .getByTestId(CryptoAssetSelectors.CryptoAssetListItem.replace('{symbol}', 'stx'))
      .click();
    await this.page.waitForURL('**' + `${RouteUrls.SendCryptoAsset}/stx`);
    await this.page.getByTestId(SendCryptoAssetSelectors.SendFormContainer).waitFor();
  }
}
