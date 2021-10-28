import { Page } from 'playwright-core';
import { createTestSelector } from '../integration/utils';
import { SendFormSelectors } from './send-form.selectors';
import { ConfirmTransferSelectors } from '@tests/page-objects/confirm-transfer-selectors';

const selectors = {
  $btnSendMaxBalance: createTestSelector(SendFormSelectors.BtnSendMaxBalance),
  $amountField: createTestSelector(SendFormSelectors.InputAmountField),
  $amountFieldError: createTestSelector(SendFormSelectors.InputAmountFieldErrorLabel),
  $stxAddressField: createTestSelector(SendFormSelectors.InputRecipientField),
  $stxAddressFieldError: createTestSelector(SendFormSelectors.InputRecipientFieldErrorLabel),
  $previewBtn: createTestSelector(SendFormSelectors.BtnPreviewSendTx),
  $transferMessage: createTestSelector(SendFormSelectors.TransferMessage),
  $settingsBtn: createTestSelector(ConfirmTransferSelectors.BtnSettings),
  $btnMultiplier1x: createTestSelector(ConfirmTransferSelectors.BtnMultiplier1x),
  $btnMultiplier2x: createTestSelector(ConfirmTransferSelectors.BtnMultiplier2x),
  $btnMultiplier5x: createTestSelector(ConfirmTransferSelectors.BtnMultiplier5x),
  $btnMultiplier10x: createTestSelector(ConfirmTransferSelectors.BtnMultiplier10x),
  $btnSendTokens: createTestSelector(ConfirmTransferSelectors.BtnSendTokens),
  $btnFeeIncrease: createTestSelector(ConfirmTransferSelectors.BtnFeeIncrease),
  $inputCustomFee: createTestSelector(ConfirmTransferSelectors.InputCustomFee),
  $btnApplySettings: createTestSelector(ConfirmTransferSelectors.BtnApplySettings),
  $confirmTransferFee: createTestSelector(ConfirmTransferSelectors.ConfirmTransferFee),
  $inputCustomFeeError: createTestSelector(ConfirmTransferSelectors.InputCustomFeeError),
  $btnSubmitFeeIncrease: createTestSelector(ConfirmTransferSelectors.BtnSubmitFeeIncrease),
  $tokenTitle: createTestSelector(SendFormSelectors.TokenTitle),
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

  async clickSettingsBtn() {
    await this.page.click(this.selectors.$settingsBtn);
  }

  async click1xBtn() {
    await this.page.click(this.selectors.$btnMultiplier1x);
  }

  async click2xBtn() {
    await this.page.click(this.selectors.$btnMultiplier2x);
  }

  async click5xBtn() {
    await this.page.click(this.selectors.$btnMultiplier5x);
  }

  async click10xBtn() {
    await this.page.click(this.selectors.$btnMultiplier10x);
  }

  async clickFeeApplyBtn() {
    await this.page.click(this.selectors.$btnApplySettings);
  }

  async clickSendTokenBtn() {
    await this.page.click(this.selectors.$btnSendTokens);
  }

  async clickSubmitIncreaseFee() {
    await this.page.click(this.selectors.$btnSubmitFeeIncrease);
  }

  async clickIncreaseFeeBtn() {
    await this.page.click(this.selectors.$btnFeeIncrease);
  }

  async getCustomFee() {
    return this.page.$eval(this.selectors.$inputCustomFee, (el: HTMLInputElement) =>
      parseFloat(el.value)
    );
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

  async waitForPreview(selector: keyof typeof selectors) {
    await this.page.waitForSelector(this.selectors[selector]);
  }

  async fillToTransferFeeField(input: string) {
    const field = await this.page.$(this.selectors.$inputCustomFee);
    await field?.fill(input);
  }
}
