import { Page } from '@playwright/test';
import { SettingsSelectors } from '@tests-legacy/integration/settings.selectors';
import { HomePageSelectorsLegacy } from '@tests-legacy/page-objects/home.selectors';
import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsMenuSelectors } from '@tests/selectors/settings.selectors';

import { RouteUrls } from '@shared/route-urls';

import { delay } from '@app/common/utils';

import {
  BrowserDriver,
  createTestSelector,
  randomString,
  timeDifference,
} from '../integration/utils';
import { WalletPageSelectors } from './wallet.selectors';

// TODO: This Page needs to be cleaned up -> create a HomePage?
// Should we create one Page for each route?
export class WalletPage {
  static url = 'http://localhost:8081/index.html#';
  $signUpButton = createTestSelector(OnboardingSelectors.SignUpBtn);
  $signInButton = createTestSelector(OnboardingSelectors.SignInLink);
  $analyticsAllowButton = createTestSelector(OnboardingSelectors.AllowAnalyticsBtn);
  $analyticsDenyButton = createTestSelector(OnboardingSelectors.DenyAnalyticsBtn);
  $homePageContainer = createTestSelector(HomePageSelectors.HomePageContainer);
  $secretKey = createTestSelector(OnboardingSelectors.SecretKey);
  $showSecretKey = createTestSelector(SettingsSelectors.ShowSecretKeyBtn);
  $buttonSignInKeyContinue = createTestSelector(OnboardingSelectors.SignInBtn);
  setPasswordDone = createTestSelector(OnboardingSelectors.SetPasswordBtn);
  $passwordInput = createTestSelector(SettingsSelectors.EnterPasswordInput);
  $newPasswordInput = createTestSelector(OnboardingSelectors.NewPasswordInput);
  $sendTokenBtn = createTestSelector(HomePageSelectors.SendCryptoAssetBtn);
  $fundAccountBtn = createTestSelector(HomePageSelectorsLegacy.BtnFundAccount);
  $confirmBackedUpSecretKey = createTestSelector(OnboardingSelectors.BackUpSecretKeyBtn);
  $password = 'mysecretreallylongpassword';
  $settingsButton = createTestSelector(SettingsMenuSelectors.SettingsMenuBtn);
  $contractCallButton = createTestSelector('btn-contract-call');
  $settingsViewSecretKey = createTestSelector(SettingsSelectors.ViewSecretKeyListItem);
  $homePageBalancesList = createTestSelector(HomePageSelectorsLegacy.BalancesList);
  $statusMessage = createTestSelector(WalletPageSelectors.StatusMessage);
  $hiroWalletLogo = createTestSelector(OnboardingSelectors.HiroWalletLogoRouteToHome);
  $signOutConfirmHasBackupCheckbox = createTestSelector(
    SettingsSelectors.SignOutConfirmHasBackupCheckbox
  );
  $signOutConfirmPasswordDisable = createTestSelector(
    SettingsSelectors.SignOutConfirmPasswordDisable
  );
  $signOutDeleteWalletBtn = createTestSelector(SettingsSelectors.BtnSignOutActuallyDeleteWallet);
  $enterPasswordInput = createTestSelector(SettingsSelectors.EnterPasswordInput);
  $unlockWalletBtn = createTestSelector(SettingsSelectors.UnlockWalletBtn);
  $magicRecoveryMessage = createTestSelector(WalletPageSelectors.MagicRecoveryMessage);
  $hideStepsBtn = createTestSelector(OnboardingSelectors.HideStepsBtn);
  $suggestedStepsList = createTestSelector(OnboardingSelectors.StepsList);
  $suggestedStepStartBtn = createTestSelector(OnboardingSelectors.StepItemStart);
  $suggestedStepDoneBadge = createTestSelector(OnboardingSelectors.StepItemDone);
  $noAssetsFundAccountLink = createTestSelector(OnboardingSelectors.NoAssetsFundAccountLink);

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async init(browser: BrowserDriver, path?: RouteUrls) {
    const background = browser.context.serviceWorkers()[0];
    const extensionId = background.url().split('/')[2];
    const pageUrl = `chrome-extension://${extensionId}/index.html#${path ?? ''}`;
    const page = await browser.context.newPage();
    await page.goto(pageUrl);
    page.on('pageerror', event => console.log('Error in wallet:', event.message));
    return new WalletPage(page);
  }

  static async getAllPages(browser: BrowserDriver) {
    const pages = await browser.context.pages();
    return pages;
  }

  async clickAllowAnalytics() {
    await this.page.click(this.$analyticsAllowButton);
  }

  async clickDenyAnalytics() {
    await this.page.click(this.$analyticsDenyButton);
  }

  async clickSignUp() {
    await this.page.click(this.$signUpButton);
  }

  async clickSignIn() {
    await this.page.click(this.$signInButton);
  }

  async clickSettingsButton() {
    await this.page.click(this.$settingsButton);
  }

  async clickContractCall() {
    await this.page.click(this.$contractCallButton);
  }

  async clickHideSteps() {
    await this.page.click(this.$hideStepsBtn);
  }

  async waitForSettingsButton() {
    await this.page.waitForSelector(this.$settingsButton, { timeout: 30000 });
  }

  async waitForHomePage() {
    await this.page.waitForSelector(this.$homePageContainer, { timeout: 30000 });
  }

  async waitForNewPasswordInput() {
    await this.page.waitForSelector(this.$newPasswordInput, { timeout: 30000 });
  }

  async waitForEnterPasswordInput() {
    await this.page.waitForSelector(this.$enterPasswordInput, { timeout: 30000 });
  }

  async waitForHiroWalletLogo() {
    await this.page.waitForSelector(this.$hiroWalletLogo, { timeout: 3000 });
  }

  async waitForWelcomePage() {
    await this.page.waitForSelector(this.$signInButton, { timeout: 3000 });
  }

  async waitForStatusMessage() {
    await this.page.waitForSelector(this.$statusMessage, { timeout: 20000 });
  }

  async waitForHideOnboardingsStepsButton() {
    await this.page.waitForSelector(this.$hideStepsBtn, { timeout: 30000 });
  }

  async waitForsuggestedStepsList() {
    await this.page.waitForSelector(this.$suggestedStepsList, { timeout: 30000 });
  }

  async loginWithPreviousSecretKey(secretKey: string) {
    await this.enterSecretKey(secretKey);
    await this.enterNewPassword();
  }

  async enterSecretKey(secretKey: string) {
    await this.page.waitForSelector('textarea');
    await this.page.fill('textarea', secretKey);
    await this.page.click(this.$buttonSignInKeyContinue);
  }

  async getSecretKey() {
    await this.page.waitForSelector(this.$secretKey);
    await this.page.locator(this.$showSecretKey).click();
    const secretKeyWords = await this.page.locator(this.$secretKey).allInnerTexts();
    return secretKeyWords.join(' ');
  }

  async backUpKeyAndSetPassword() {
    await this.page.click(this.$confirmBackedUpSecretKey);
    await this.enterNewPassword();
    await delay(1000);
  }

  async goTo(path: RouteUrls) {
    await this.page.evaluate(`location.hash = '${path}'`);
  }

  async goToSecretKey() {
    await this.clickSettingsButton();
    await this.page.click(this.$settingsViewSecretKey);
  }

  async enterNewPassword(password?: string) {
    await this.page.fill(
      `input[data-testid=${OnboardingSelectors.NewPasswordInput}]`,
      password ?? this.$password
    );
    await this.page.click(this.setPasswordDone);
  }

  async enterPasswordAndUnlockWallet(password?: string) {
    await this.page.fill(
      `input[data-testid=${SettingsSelectors.EnterPasswordInput}]`,
      password ?? this.$password
    );
    await this.page.click(this.$unlockWalletBtn);
  }

  async decryptRecoveryCode(password: string) {
    await this.page.fill('input[type="password"]', password);
    await this.page.click(createTestSelector('decrypt-recovery-button'));
  }

  async goToSendForm() {
    await this.page.click(this.$sendTokenBtn);
  }

  async goToFundPage() {
    await this.page.click(this.$fundAccountBtn);
  }

  async waitForMagicRecoveryMessage() {
    await this.page.waitForSelector(this.$magicRecoveryMessage, { timeout: 30000 });
  }

  async waitForSendButton() {
    await this.page.waitForSelector(this.$sendTokenBtn, { timeout: 30000 });
  }

  /** Sign up with a randomly generated seed phrase */
  async signUp() {
    await this.clickDenyAnalytics();
    await this.clickSignUp();
    await this.backUpKeyAndSetPassword();
    await this.waitForHomePage();
  }

  async signIn(secretKey: string) {
    await this.clickDenyAnalytics();
    await this.clickSignIn();
    let startTime = new Date();
    await this.enterSecretKey(secretKey);
    await this.waitForNewPasswordInput();
    console.log(
      `Page load time for 12 or 24 word Secret Key: ${timeDifference(
        startTime,
        new Date()
      )} seconds`
    );
    const password = randomString(15);
    startTime = new Date();
    await this.enterNewPassword(password);
    await this.waitForHomePage();
    console.log(
      `Page load time for sign in with password: ${timeDifference(startTime, new Date())} seconds`
    );
  }
}
