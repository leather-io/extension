import { Page } from '@playwright/test';
import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { createTestSelector } from '@tests/utils';

export class NetworkPage {
  readonly networkNameSelector = createTestSelector(NetworkSelectors.NetworkName);
  readonly networkStacksAddressSelector = createTestSelector(NetworkSelectors.NetworkStacksAddress);
  readonly networkBitcoinAddressSelector = createTestSelector(
    NetworkSelectors.NetworkBitcoinAddress
  );
  readonly networkKeySelector = createTestSelector(NetworkSelectors.NetworkKey);
  readonly btnAddNetworkSelector = createTestSelector(NetworkSelectors.BtnAddNetwork);
  readonly errorTextSelector = createTestSelector(NetworkSelectors.ErrorText);

  constructor(readonly page: Page) {}

  async inputNetworkNameField(input: string) {
    const field = this.page.locator(this.networkNameSelector);
    await field?.fill(input);
  }

  async inputNetworkStacksAddressField(input: string) {
    const field = this.page.locator(this.networkStacksAddressSelector);
    await field?.fill(input);
  }

  async inputNetworkBitcoinAddressField(input: string) {
    const field = this.page.locator(this.networkBitcoinAddressSelector);
    await field?.fill(input);
  }

  async inputNetworkKeyField(input: string) {
    const field = this.page.locator(this.networkKeySelector);
    await field?.fill(input);
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
