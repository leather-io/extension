import { Locator, Page } from '@playwright/test';
import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { createTestSelector } from '@tests/utils';

import { WalletDefaultNetworkConfigurationIds } from '@shared/constants';

export class HomePage {
  readonly page: Page;
  readonly drawerActionButton: Locator;
  readonly receiveButton: Locator;
  readonly sendButton: Locator;
  readonly swapButton: Locator;
  readonly settingsButton: Locator;
  readonly settingsViewSecretKey: Locator;
  readonly signOutConfirmHasBackupCheckbox: Locator;
  readonly signOutConfirmPasswordDisable: Locator;
  readonly signOutDeleteWalletBtn: Locator;
  readonly signOutSettingsListItem: Locator;
  readonly lockSettingsListItem: Locator;
  readonly fundAccountBtn: Locator;

  readonly testNetworkSelector: string = createTestSelector(
    WalletDefaultNetworkConfigurationIds.testnet
  );

  $signOutConfirmHasBackupCheckbox = createTestSelector(
    SettingsSelectors.SignOutConfirmHasBackupCheckbox
  );
  $signOutConfirmPasswordDisable = createTestSelector(
    SettingsSelectors.SignOutConfirmPasswordDisable
  );
  $signOutDeleteWalletBtn = createTestSelector(SettingsSelectors.BtnSignOutActuallyDeleteWallet);

  constructor(page: Page) {
    this.page = page;
    this.drawerActionButton = page.getByTestId(HomePageSelectors.DrawerHeaderActionBtn);
    this.receiveButton = page.getByTestId(HomePageSelectors.ReceiveCryptoAssetBtn);
    this.sendButton = page.getByTestId(HomePageSelectors.SendCryptoAssetBtn);
    this.swapButton = page.getByTestId(HomePageSelectors.SwapBtn);
    this.settingsButton = page.getByTestId(SettingsSelectors.SettingsMenuBtn);
    this.settingsViewSecretKey = page.getByTestId(SettingsSelectors.ViewSecretKeyListItem);
    this.signOutConfirmHasBackupCheckbox = page.getByTestId(
      SettingsSelectors.SignOutConfirmHasBackupCheckbox
    );
    this.signOutConfirmPasswordDisable = page.getByTestId(
      SettingsSelectors.SignOutConfirmPasswordDisable
    );
    this.signOutDeleteWalletBtn = page.getByTestId(
      SettingsSelectors.BtnSignOutActuallyDeleteWallet
    );
    this.signOutSettingsListItem = page.getByTestId(SettingsSelectors.SignOutListItem);
    this.lockSettingsListItem = page.getByTestId(SettingsSelectors.LockListItem);
    this.fundAccountBtn = page.getByTestId(HomePageSelectors.FundAccountBtn);
  }

  async goToReceiveModal() {
    await this.page.getByTestId(HomePageSelectors.ReceiveCryptoAssetBtn).click();
  }

  async goToSwapPage() {
    await this.page.getByTestId(HomePageSelectors.SwapBtn).click();
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
    await this.page.getByTestId(SettingsSelectors.SettingsMenuBtn).click();
    await this.page.getByTestId(SettingsSelectors.ChangeNetworkAction).click();
    await this.page.waitForTimeout(1000);
    await (
      await this.page.waitForSelector(this.testNetworkSelector, { timeout: 30000 })
    ).isVisible();
    await this.page.getByTestId(WalletDefaultNetworkConfigurationIds.testnet).click();
  }

  async clickActivityTab() {
    await this.page.getByTestId(HomePageSelectors.ActivityTabBtn).click();
  }

  async clickSettingsButton() {
    await this.settingsButton.click();
  }

  async goToSecretKey() {
    await this.clickSettingsButton();
    await this.settingsViewSecretKey.click();
  }

  async signOut() {
    await this.clickSettingsButton();
    await this.signOutSettingsListItem.click();
    await this.signOutConfirmHasBackupCheckbox.click();
    await this.signOutConfirmPasswordDisable.click();
    await this.signOutDeleteWalletBtn.click();
  }

  async lock() {
    await this.clickSettingsButton();
    await this.lockSettingsListItem.click();
  }

  async goToFundChooseCurrencyPage() {
    await this.fundAccountBtn.click();
  }
}
