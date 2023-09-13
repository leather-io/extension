import { Page } from '@playwright/test';
import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { createTestSelector } from '@tests/utils';

export class NetworkPage {
  readonly networkNameSelector = createTestSelector(NetworkSelectors.NetworkName);
  readonly networkAddressSelector = createTestSelector(NetworkSelectors.NetworkAddress);
  readonly networkKeySelector = createTestSelector(NetworkSelectors.NetworkKey);
  readonly btnAddNetworkSelector = createTestSelector(NetworkSelectors.BtnAddNetwork);
  readonly errorTextSelector = createTestSelector(NetworkSelectors.ErrorText);

  constructor(readonly page: Page) {}

  async inputNetworkNameField(input: string) {
    const field = this.page.locator(this.networkNameSelector);
    await field?.type(input);
  }

  async inputNetworkAddressField(input: string) {
    const field = this.page.locator(this.networkAddressSelector);
    await field?.type(input);
  }

  async inputNetworkKeyField(input: string) {
    const field = this.page.locator(this.networkKeySelector);
    await field?.type(input);
  }

  async waitForErrorMessage() {
    await this.page.waitForSelector(this.errorTextSelector);
  }

  async getErrorMessage() {
    return this.page.locator(this.errorTextSelector);
  }

  async clickAddNetwork() {
    await this.page.locator(this.btnAddNetworkSelector).click();
  }
}
