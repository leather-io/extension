import { Locator, Page } from '@playwright/test';
import { SettingsSelectors } from '@tests-legacy/integration/settings.selectors';
import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { SettingsMenuSelectors } from '@tests/selectors/settings.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { createTestSelector } from '@tests/utils';

import { WalletDefaultNetworkConfigurationIds } from '@shared/constants';

export class HomePage {
  readonly page: Page;
  readonly drawerActionButton: Locator;
  readonly receiveButton: Locator;
  readonly sendButton: Locator;
  readonly testNetworkSelector: string = createTestSelector(
    WalletDefaultNetworkConfigurationIds.testnet
  );

  constructor(page: Page) {
    this.page = page;
    this.drawerActionButton = page.getByTestId(HomePageSelectors.DrawerHeaderActionBtn);
    this.receiveButton = page.getByTestId(HomePageSelectors.ReceiveCryptoAssetBtn);
    this.sendButton = page.getByTestId(HomePageSelectors.SendCryptoAssetBtn);
  }

  async goToReceiveModal() {
    await this.page.getByTestId(HomePageSelectors.ReceiveCryptoAssetBtn).click();
  }

  // Open issue with Playwright's ability to copyToClipboard from legacy tests:
  // https://github.com/microsoft/playwright/issues/8114#issuecomment-1103317576
  // Also, an open issue to consistently determine `isMac` in the workaround:
  // https://github.com/microsoft/playwright/issues/12168
  // Using the `Receive` route to get the account address for now.
  async getReceiveNativeSegwitAddress() {
    await this.goToReceiveModal();
    await this.page.getByTestId(HomePageSelectors.ReceiveBtcNativeSegwitQrCodeBtn).click();
    const displayerAddress = await this.page
      .getByTestId(SharedComponentsSelectors.AddressDisplayer)
      .innerText();
    return displayerAddress.replaceAll('\n', '');
  }

  // Currently under Ordinals receive flow
  async getReceiveTaprootAddress() {
    await this.goToReceiveModal();
    await this.page.getByTestId(HomePageSelectors.ReceiveBtcTaprootQrCodeBtn).click();
    await this.page.getByRole('button', { name: 'Copy address' }).click();
    return this.page.evaluate('navigator.clipboard.readText()');
  }

  async getReceiveStxAddress() {
    await this.goToReceiveModal();
    // In Ledger mode, this element isn't visible, so clicking is conditional
    const qrCodeBtn = this.page.getByTestId(HomePageSelectors.ReceiveStxQrCodeBtn);
    if (await qrCodeBtn.isVisible()) await qrCodeBtn.click();
    const displayerAddress = await this.page
      .getByTestId(SharedComponentsSelectors.AddressDisplayer)
      .innerText();
    return displayerAddress.replaceAll('\n', '');
  }

  async enableTestMode() {
    await this.page.getByTestId(SettingsMenuSelectors.SettingsMenuBtn).click();
    await this.page.getByTestId(SettingsSelectors.ChangeNetworkAction).click();
    await (
      await this.page.waitForSelector(this.testNetworkSelector, { timeout: 30000 })
    ).isEnabled();
    await this.page.getByTestId(WalletDefaultNetworkConfigurationIds.testnet).click();
  }

  async clickActivityTab() {
    await this.page.getByTestId(HomePageSelectors.ActivityTabBtn).click();
  }
}
