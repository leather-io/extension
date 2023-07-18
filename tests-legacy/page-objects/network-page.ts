import { Page } from '@playwright/test';
import { NetworkSelectors } from '@tests-legacy/integration/network.selectors';

import { createTestSelector } from '../integration/utils';

const selectors = {
  $networkName: createTestSelector(NetworkSelectors.NetworkName),
  $networkAddress: createTestSelector(NetworkSelectors.NetworkAddress),
  $networkKey: createTestSelector(NetworkSelectors.NetworkKey),
  $btnAddNetwork: createTestSelector(NetworkSelectors.BtnAddNetwork),
  $errorText: createTestSelector(NetworkSelectors.ErrorText),
};

export class NetworkPage {
  selectors = selectors;
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getSelector(selector: keyof typeof selectors) {
    return this.selectors[selector];
  }

  async inputNetworkNameField(input: string) {
    const field = await this.page.$(this.selectors.$networkName);
    await field?.type(input);
  }

  async inputNetworkAddressField(input: string) {
    const field = await this.page.$(this.selectors.$networkAddress);
    await field?.type(input);
  }

  async inputNetworkKeyField(input: string) {
    const field = await this.page.$(this.selectors.$networkKey);
    await field?.type(input);
  }

  async waitForErrorMessage() {
    await this.page.waitForSelector(this.selectors.$errorText);
  }

  async clickAddNetwork() {
    await this.page.click(this.selectors.$btnAddNetwork);
  }
}
