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
  readonly btnAddNetworkSelector = createTestSelector(NetworkSelectors.AddNetworkBtn);
  readonly errorTextSelector = createTestSelector(NetworkSelectors.ErrorText);

  constructor(readonly page: Page) {}

  async waitForNetworkPageReady() {
    await this.page.waitForSelector(createTestSelector(NetworkSelectors.NetworkPageReady), {
      state: 'attached',
    });
  }

  async inputNetworkNameField(input: string) {
    await this.page.locator(this.networkNameSelector).fill(input);
  }

  async inputNetworkStacksAddressField(input: string) {
    await this.page.locator(this.networkStacksAddressSelector).fill(input);
  }

  async inputNetworkBitcoinAddressField(input: string) {
    await this.page.locator(this.networkBitcoinAddressSelector).fill(input);
  }

  async inputNetworkKeyField(input: string) {
    await this.page.locator(this.networkKeySelector).fill(input);
  }

  async waitForErrorMessage() {
    await this.page.waitForSelector(this.errorTextSelector);
  }

  async getErrorMessage() {
    return this.page.locator(this.errorTextSelector);
  }

  async clickAddNetwork() {
    await this.page.locator(this.btnAddNetworkSelector).click({ force: true });
  }
}
