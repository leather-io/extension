import { Page } from '@playwright/test';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { createTestSelector } from '../integration/utils';
import { TransactionSigningSelectors } from './transaction-signing.selectors';

const selectors = {
  $pageContainer: createTestSelector(TransactionSigningSelectors.TxSigningPageContainer),
  $feeToBePaidLabel: createTestSelector(SharedComponentsSelectors.FeeToBePaidLabel),
  $broadcastTxBtn: createTestSelector(TransactionSigningSelectors.BtnConfirmTransaction),
};

export class TransactionSigningPage {
  selectors = selectors;

  constructor(public page: Page) {}

  async select(selector: keyof typeof selectors) {
    return this.page.$(selectors[selector]);
  }

  async waitForPageToRender() {
    await this.page.waitForSelector(selectors.$pageContainer);
  }

  async waitForFeeEstimationsToLoad() {
    await this.page.waitForSelector(selectors.$feeToBePaidLabel);
  }

  async getDisplayedFeeValue() {
    return this.page.textContent(selectors.$feeToBePaidLabel);
  }

  async clickBroadcastTxButton() {
    return this.page.click(selectors.$broadcastTxBtn);
  }
}
