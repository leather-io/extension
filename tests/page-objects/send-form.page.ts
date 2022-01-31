import { Page } from 'playwright-core';
import { createTestSelector } from '../integration/utils';
import { SendFormSelectors } from './send-form.selectors';
import { TransactionSigningSelectors } from '@tests/page-objects/transaction-signing.selectors';
import { WalletPageSelectors } from '@tests/page-objects/wallet.selectors';

const selectors = {
  $btnSendMaxBalance: createTestSelector(SendFormSelectors.BtnSendMaxBalance),
  $amountField: createTestSelector(SendFormSelectors.InputAmountField),
  $amountFieldError: createTestSelector(SendFormSelectors.InputAmountFieldErrorLabel),
  $memoField: createTestSelector(SendFormSelectors.MemoField),
  $memoFieldError: createTestSelector(SendFormSelectors.MemoFieldErrorLabel),
  $stxAddressField: createTestSelector(SendFormSelectors.InputRecipientField),
  $stxAddressFieldError: createTestSelector(SendFormSelectors.InputRecipientFieldErrorLabel),
  $feeEstimateItem: createTestSelector(SendFormSelectors.FeeEstimateItem),
  $feeEstimateSelect: createTestSelector(SendFormSelectors.FeeEstimateSelect),
  $customFeeField: createTestSelector(SendFormSelectors.InputCustomFeeField),
  $previewBtn: createTestSelector(SendFormSelectors.BtnPreviewSendTx),
  $confirmDetails: createTestSelector(SendFormSelectors.ConfirmDetails),
  $stxTokenOption: createTestSelector(SendFormSelectors.StxTokenOption),
  $stellaTokenOption: createTestSelector(SendFormSelectors.StellaTokenOption),
  $lowFeeSelect: createTestSelector(SendFormSelectors.LowFeesOption),
  $highFeeSelect: createTestSelector(SendFormSelectors.HighFeesOption),
  $standardFeeSelect: createTestSelector(SendFormSelectors.StandardFeesOption),
  $customFeeSelect: createTestSelector(SendFormSelectors.CustomFeesOption),
  $assetSelect: createTestSelector(SendFormSelectors.AssetSelect),
  $selectedAssetOption: createTestSelector(SendFormSelectors.SelectedAssetOption),
  $transferMessage: createTestSelector(SendFormSelectors.TransferMessage),
  $feeError: createTestSelector(SendFormSelectors.InputCustomFeeFieldError),
  $account1: createTestSelector(SendFormSelectors.OptionAccount1),
  $confirmTransaction: createTestSelector(TransactionSigningSelectors.BtnConfirmTransaction),
  $statusMessage: createTestSelector(WalletPageSelectors.StatusMessage),
  $sendToken: createTestSelector(SendFormSelectors.SendToken),
  $pendingStatus: createTestSelector(SendFormSelectors.PendingStatus),
  $sentTokenValue: createTestSelector(SendFormSelectors.SentTokenValue),
};

export class SendPage {
  selectors = selectors;

  constructor(public page: Page) {}

  async select(selector: keyof typeof selectors) {
    return this.page.$(selectors[selector]);
  }

  getSelector(selector: keyof typeof selectors) {
    return this.selectors[selector];
  }

  async clickSendMaxBtn() {
    await this.page.click(this.selectors.$btnSendMaxBalance);
  }

  async clickPreviewTxBtn() {
    await this.page.click(this.selectors.$previewBtn);
  }

  async getAmountFieldValue() {
    return this.page.$eval(this.selectors.$amountField, (el: HTMLInputElement) => el.value);
  }

  async inputToAmountField(input: string) {
    const field = await this.page.$(this.selectors.$amountField);
    await field?.type(input);
  }

  async fillToAmountField(input: string) {
    const field = await this.page.$(this.selectors.$amountField);
    await field?.fill(input);
  }

  async inputToAddressField(input: string) {
    const field = await this.page.$(this.selectors.$stxAddressField);
    await field?.type(input);
  }

  async inputToMemoField(input: string) {
    const field = await this.page.$(this.selectors.$memoField);
    await field?.type(input);
  }

  async waitForFeeEstimateItem() {
    await this.page.waitForSelector(this.selectors.$feeEstimateItem);
  }

  async clickFeeEstimateItem() {
    await this.waitForFeeEstimateItem();
    await this.page.click(this.selectors.$feeEstimateItem);
  }

  async waitForFeeEstimateSelect() {
    await this.page.waitForSelector(this.selectors.$feeEstimateSelect);
  }

  async selectFirstFeeEstimate() {
    await this.clickFeeEstimateItem();
    await this.waitForFeeEstimateSelect();
    await this.page.locator(this.getSelector('$lowFeeSelect')).click();
  }

  async inputToCustomFeeField(input: string) {
    await this.clickFeeEstimateItem();
    await this.waitForFeeEstimateSelect();
    await this.page.locator(this.getSelector('$customFeeSelect')).click();

    const field = await this.page.$(this.selectors.$customFeeField);
    await field?.type(input);
  }

  async waitForConfirmDetails() {
    await this.page.waitForSelector(this.selectors.$confirmDetails);
  }

  async waitForSendMaxButton() {
    await this.page.waitForSelector(this.selectors.$btnSendMaxBalance);
  }

  async selectStxFromDropdown() {
    await this.page.waitForSelector('[data-asset="stx"]');
    await this.page.click('[data-asset="stx"]');
  }

  async clickSTXTokenOption() {
    await this.page.click(this.selectors.$stxTokenOption);
  }

  async clickStellaTokenOption() {
    await this.page.click(this.selectors.$stellaTokenOption);
  }

  async clickAssetSelect() {
    await this.page.click(this.selectors.$assetSelect);
  }

  async clickSelectedAsset() {
    await this.page.click(this.selectors.$selectedAssetOption);
  }

  async clickFeeEstimateSelect(value: keyof typeof selectors) {
    await this.page.click(this.selectors[value]);
  }

  async selectLowFeeOption() {
    await this.page.click(this.selectors.$lowFeeSelect);
  }

  async selectHighFeeOption() {
    await this.page.click(this.selectors.$highFeeSelect);
  }

  async selectStandardFeeOption() {
    await this.page.click(this.selectors.$standardFeeSelect);
  }

  async selectCustomFeeOption() {
    await this.page.click(this.selectors.$customFeeSelect);
  }

  async waitForAmountField() {
    await this.page.waitForSelector(this.selectors.$amountField);
  }

  async waitForSelectedAssetOption() {
    await this.page.waitForSelector(this.selectors.$selectedAssetOption);
  }

  async waitForAssetSelect() {
    await this.page.waitForSelector(this.selectors.$assetSelect);
  }

  async waitForPreview(selector: keyof typeof selectors) {
    await this.page.waitForSelector(this.selectors[selector]);
  }

  async inputFee(input: string) {
    const field = await this.page.$(this.selectors.$customFeeField);
    await field?.type(input);
  }

  async getCustomFeeValue() {
    return this.page.$eval(this.selectors.$customFeeField, (el: HTMLInputElement) => el.value);
  }

  async clickFirstAccount() {
    await this.page.click(this.selectors.$account1);
  }

  async clickConfirmTransaction() {
    await this.page.click(this.selectors.$confirmTransaction);
  }

  async clickSendToken() {
    await this.page.click(this.selectors.$sendToken);
  }
}
