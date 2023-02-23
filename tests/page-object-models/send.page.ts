import { Locator, Page } from '@playwright/test';
import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { RouteUrls } from '@shared/route-urls';

export class SendPage {
  readonly page: Page;
  readonly amountInput: Locator;
  readonly amountInputErrorLabel: Locator;
  readonly confirmationDetails: Locator;
  readonly formInputErrorLabel: Locator;
  readonly memoInput: Locator;
  readonly previewSendTxButton: Locator;
  readonly recipientChooseAccountButton: Locator;
  readonly recipientInput: Locator;
  readonly resolvedBnsAddressLabel: Locator;
  readonly resolvedBnsAddressInfoIcon: Locator;
  readonly sendMaxButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.amountInput = this.page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput);
    this.amountInputErrorLabel = this.page.getByTestId(
      SendCryptoAssetSelectors.AmountFieldInputErrorLabel
    );
    this.confirmationDetails = this.page.getByTestId(SendCryptoAssetSelectors.ConfirmationDetails);
    this.formInputErrorLabel = page.getByTestId(SendCryptoAssetSelectors.FormFieldInputErrorLabel);
    this.memoInput = this.page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput);
    this.previewSendTxButton = page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn);
    this.recipientChooseAccountButton = page.getByTestId(
      SendCryptoAssetSelectors.RecipientChooseAccountButton
    );
    this.recipientInput = this.page.getByTestId(SendCryptoAssetSelectors.RecipientFieldInput);
    this.resolvedBnsAddressLabel = this.page.getByTestId(
      SendCryptoAssetSelectors.ResolvedBnsAddressLabel
    );
    this.resolvedBnsAddressInfoIcon = page.getByTestId(
      SendCryptoAssetSelectors.ResolvedBnsAddressInfoIcon
    );
    this.sendMaxButton = page.getByTestId(SendCryptoAssetSelectors.SendMaxBtn);
  }

  async selectBtcAndGoToSendForm() {
    await this.page.waitForURL('**' + RouteUrls.SendCryptoAsset);
    await this.page
      .getByTestId(CryptoAssetSelectors.CryptoAssetListItem.replace('{symbol}', 'btc'))
      .click();
    await this.page.waitForURL('**' + `${RouteUrls.SendCryptoAsset}/btc`);
    await this.page.getByTestId(SendCryptoAssetSelectors.SendForm).waitFor();
  }

  async selectStxAndGoToSendForm() {
    await this.page.waitForURL('**' + RouteUrls.SendCryptoAsset);
    await this.page
      .getByTestId(CryptoAssetSelectors.CryptoAssetListItem.replace('{symbol}', 'stx'))
      .click();
    await this.page.waitForURL('**' + `${RouteUrls.SendCryptoAsset}/stx`);
    await this.page.getByTestId(SendCryptoAssetSelectors.SendForm).waitFor();
  }
}
