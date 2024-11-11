import { Locator, Page } from '@playwright/test';
import { MockedTokensSelectors } from '@tests/selectors/mocked-tokens.selectors';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { createTestSelector } from '@tests/utils';

import { RouteUrls } from '@shared/route-urls';

export class SendPage {
  readonly page: Page;
  readonly amountInput: Locator;
  readonly amountInputErrorLabel: Locator;
  readonly confirmationDetails: Locator;
  readonly confirmationDetailsRecipient: Locator;
  readonly formInputErrorLabel: Locator;
  readonly memoInput: Locator;
  readonly previewSendTxButton: Locator;
  readonly recipientChooseAccountButton: Locator;
  readonly recipientSelectRecipientTypeDropdown: Locator;
  readonly recipientSelectFieldAddress: Locator;
  readonly recipientSelectFieldBnsName: Locator;
  readonly recipientInput: Locator;
  readonly recipientBnsAddressLabel: Locator;
  readonly sendMaxButton: Locator;
  readonly feesRow: Locator;
  readonly memoRow: Locator;
  readonly feesListItem: Locator;
  readonly feeToBePaid: Locator;
  readonly infoCardButton: Locator;
  readonly broadcastErrorTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.amountInput = this.page.getByTestId(SendCryptoAssetSelectors.AmountFieldInput);
    this.amountInputErrorLabel = this.page.getByTestId(
      SendCryptoAssetSelectors.AmountFieldInputErrorLabel
    );
    this.confirmationDetails = this.page.getByTestId(SendCryptoAssetSelectors.ConfirmationDetails);
    this.confirmationDetailsRecipient = this.page.getByTestId(
      SendCryptoAssetSelectors.ConfirmationDetailsRecipient
    );
    this.formInputErrorLabel = page.getByTestId(SendCryptoAssetSelectors.FormFieldInputErrorLabel);
    this.memoInput = this.page.getByTestId(SendCryptoAssetSelectors.MemoFieldInput);
    this.previewSendTxButton = page.getByTestId(SendCryptoAssetSelectors.PreviewSendTxBtn);
    this.recipientChooseAccountButton = page.getByTestId(
      SendCryptoAssetSelectors.RecipientChooseAccountButton
    );
    this.page.getByTestId(SendCryptoAssetSelectors.RecipientSelectFieldAddress);
    this.recipientSelectRecipientTypeDropdown = this.page.getByTestId(
      SendCryptoAssetSelectors.RecipientSelectRecipientTypeDropdown
    );
    this.recipientSelectFieldAddress = this.page.getByTestId(
      SendCryptoAssetSelectors.RecipientSelectFieldAddress
    );
    this.recipientSelectFieldBnsName = this.page.getByTestId(
      SendCryptoAssetSelectors.RecipientSelectFieldBnsName
    );
    this.recipientInput = this.page.getByTestId(SendCryptoAssetSelectors.RecipientFieldInput);
    this.recipientBnsAddressLabel = this.page.getByTestId(
      SendCryptoAssetSelectors.RecipientBnsAddressLabel
    );
    this.feesRow = page.getByTestId(SendCryptoAssetSelectors.ConfirmationDetailsFee);
    this.memoRow = page.getByTestId(SendCryptoAssetSelectors.ConfirmationDetailsMemo);

    this.sendMaxButton = page.getByTestId(SendCryptoAssetSelectors.SendMaxBtn);
    this.feesListItem = page.getByTestId(SharedComponentsSelectors.FeesListItem);
    this.feeToBePaid = page.getByTestId(SharedComponentsSelectors.FeeToBePaidLabel);
    this.infoCardButton = page.getByTestId(SharedComponentsSelectors.InfoCardButton);
    this.broadcastErrorTitle = page.getByTestId(SharedComponentsSelectors.BroadcastErrorTitle);
  }

  async selectBtcAndGoToSendForm() {
    await this.page.waitForURL('**' + RouteUrls.SendCryptoAsset);
    await this.page.getByTestId('BTC').click();
    await this.page.waitForURL('**' + `${RouteUrls.SendCryptoAsset}/btc`);
    await this.page.getByTestId(SendCryptoAssetSelectors.SendForm).waitFor();
  }

  async selectStxAndGoToSendForm() {
    await this.page.waitForURL('**' + RouteUrls.SendCryptoAsset);
    await this.page.getByTestId('STX').click();
    await this.page.waitForURL('**' + `${RouteUrls.SendCryptoAsset}/stx`);
    await this.page.getByTestId(SendCryptoAssetSelectors.SendForm).waitFor();
  }

  async selectSIP10AndGoToSendForm() {
    await this.page.waitForURL('**' + RouteUrls.SendCryptoAsset);
    await this.page.getByTestId(MockedTokensSelectors.Sip10TokenTestId).click();
    await this.page.getByTestId(SendCryptoAssetSelectors.SendForm).waitFor();
  }

  async waitForSendPageReady() {
    await this.page.waitForSelector(createTestSelector(SendCryptoAssetSelectors.SendPageReady), {
      state: 'attached',
    });
  }

  async goBack() {
    await this.page.getByTestId(SharedComponentsSelectors.HeaderBackBtn).click({ force: true });
  }

  async goBackSelectStx() {
    await this.goBack();
    await this.selectStxAndGoToSendForm();
  }

  async clickInfoCardButton() {
    await this.infoCardButton.click();
  }

  async waitForFeeRow() {
    await this.page.getByTestId(SharedComponentsSelectors.FeeRow).waitFor({ state: 'attached' });
  }

  async selectInscription() {
    const inscriptions = this.page.getByTestId(SendCryptoAssetSelectors.Inscription);
    const sendButton = this.page.getByTestId(SendCryptoAssetSelectors.InscriptionSendButton);
    const count = await inscriptions.count();
    if (count === 1) {
      await inscriptions.hover();
      await this.page
        .getByTestId(SendCryptoAssetSelectors.InscriptionSendButton)
        .click({ force: true });
    } else {
      await inscriptions.nth(0).hover();
      await sendButton.nth(0).click({ force: true });
    }
  }

  async confirmSendTransaction() {
    await this.page.getByTestId(SendCryptoAssetSelectors.ConfirmSendTxBtn).click();
  }
}
