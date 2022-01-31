import { Page } from 'playwright-core';
import { createTestSelector } from '../integration/utils';
import { SendFormSelectors } from './send-form.selectors';

const selectors = {
  $btnSendMaxBalance: createTestSelector(SendFormSelectors.BtnSendMaxBalance),
  $amountField: createTestSelector(SendFormSelectors.InputAmountField),
  $amountFieldError: createTestSelector(SendFormSelectors.InputAmountFieldErrorLabel),
  $stxAddressField: createTestSelector(SendFormSelectors.InputRecipientField),
  $stxAddressFieldError: createTestSelector(SendFormSelectors.InputRecipientFieldErrorLabel),
  $feeEstimateItem: createTestSelector(SendFormSelectors.FeeEstimateItem),
  $feeEstimateSelect: createTestSelector(SendFormSelectors.FeeEstimateSelect),
  $customFeeField: createTestSelector(SendFormSelectors.InputCustomFeeField),
  $previewBtn: createTestSelector(SendFormSelectors.BtnPreviewSendTx),
  $confirmDetails: createTestSelector(SendFormSelectors.ConfirmDetails),
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
    await this.page.locator(this.getSelector('$feeEstimateItem')).nth(1).click();
  }

  async inputToCustomFeeField(input: string) {
    await this.clickFeeEstimateItem();
    await this.waitForFeeEstimateSelect();
    await this.page.locator(this.getSelector('$feeEstimateItem')).last().click();

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
}
