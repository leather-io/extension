import { Page } from '@playwright/test';
import { TransactionRequestSelectors } from '@tests/selectors/requests.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { createTestSelector } from '@tests/utils';

export class TransactionRequestPage {
  readonly confirmTransactionBtnSelector = createTestSelector(
    TransactionRequestSelectors.BtnConfirmTransaction
  );
  readonly feeToBePaidLabel = createTestSelector(SharedComponentsSelectors.FeeToBePaidLabel);
  readonly transactionRequestPage = createTestSelector(
    TransactionRequestSelectors.TransactionRequestPage
  );

  constructor(readonly page: Page) {}

  async clickConfirmTransactionButton() {
    return this.page.click(this.confirmTransactionBtnSelector);
  }

  async getDisplayedFeeValue() {
    return this.page.locator(this.feeToBePaidLabel).innerText();
  }

  async waitForTransactionRequestError(msg: string) {
    return this.page.waitForSelector(`text=${msg}`);
  }

  async waitForFee() {
    await this.page.locator(this.feeToBePaidLabel).waitFor();
  }

  async waitForTransactionRequestPage() {
    await this.page.locator(this.transactionRequestPage).waitFor();
  }
}
