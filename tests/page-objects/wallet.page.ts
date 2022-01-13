import { Page } from 'playwright-core';

import { RouteUrls } from '@shared/route-urls';
import { OnboardingSelectors } from '@tests/integration/onboarding.selectors';
import { HomePageSelectors } from '@tests/page-objects/home-page.selectors';
import { SettingsSelectors } from '@tests/integration/settings.selectors';
import { BuyTokensSelectors } from '@tests/page-objects/buy-tokens-selectors';

import {
  createTestSelector,
  wait,
  BrowserDriver,
  randomString,
  timeDifference,
} from '../integration/utils';
import { WalletPageSelectors } from './wallet.selectors';

export class WalletPage {
  static url = 'http://localhost:8081/index.html#';
  $signUpButton = createTestSelector(OnboardingSelectors.SignUpBtn);
  $signInButton = createTestSelector(OnboardingSelectors.SignInLink);
  $analyticsAllowButton = createTestSelector(OnboardingSelectors.AnalyticsAllowBtn);
  $analyticsDenyButton = createTestSelector(OnboardingSelectors.AnalyticsDenyBtn);
  homePage = createTestSelector('home-page');
  $secretKey = createTestSelector(OnboardingSelectors.SecretKey);
  $buttonSignInKeyContinue = createTestSelector(OnboardingSelectors.SignInBtn);
  setPasswordDone = createTestSelector(OnboardingSelectors.SetPasswordBtn);
  $passwordInput = createTestSelector(SettingsSelectors.EnterPasswordInput);
  $newPasswordInput = createTestSelector(OnboardingSelectors.NewPasswordInput);
  $confirmPasswordInput = createTestSelector(OnboardingSelectors.ConfirmPasswordInput);
  sendTokenBtnSelector = createTestSelector(WalletPageSelectors.BtnSendTokens);
  buyTokenBtnSelector = createTestSelector(BuyTokensSelectors.BtnBuyTokens);
  $confirmBackedUpSecretKey = createTestSelector(OnboardingSelectors.BackUpSecretKeyBtn);
  lowerCharactersErrMsg =
    'text="You can only use lowercase letters (a–z), numbers (0–9), and underscores (_)."';
  signInKeyError = createTestSelector('sign-in-seed-error');
  password = 'mysecretreallylongpassword';
  $settingsButton = createTestSelector(SettingsSelectors.MenuBtn);
  $contractCallButton = createTestSelector('btn-contract-call');
  $settingsViewSecretKey = createTestSelector(SettingsSelectors.ViewSecretKeyListItem);
  $homePageBalancesList = createTestSelector(HomePageSelectors.BalancesList);
  $createAccountButton = createTestSelector(SettingsSelectors.BtnCreateAccount);
  $createAccountDone = createTestSelector(SettingsSelectors.BtnCreateAccountDone);
  $statusMessage = createTestSelector(WalletPageSelectors.StatusMessage);
  $hiroWalletLogo = createTestSelector(OnboardingSelectors.HiroWalletLogoRouteToHome);
  $signOutConfirmHasBackupCheckbox = createTestSelector(
    SettingsSelectors.SignOutConfirmHasBackupCheckbox
  );
  $signOutDeleteWalletBtn = createTestSelector(SettingsSelectors.BtnSignOutActuallyDeleteWallet);
  $enterPasswordInput = createTestSelector(SettingsSelectors.EnterPasswordInput);
  $unlockWalletBtn = createTestSelector(SettingsSelectors.UnlockWalletBtn);
  $magicRecoveryMessage = createTestSelector(WalletPageSelectors.MagicRecoveryMessage);

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async init(browser: BrowserDriver, path?: RouteUrls) {
    const background = browser.context.backgroundPages()[0];
    const pageUrl: string = await background.evaluate(`openOptionsPage("${path || ''}")`);
    const page = await browser.context.newPage();
    await page.goto(pageUrl);
    page.on('pageerror', (event: { message: any }) => {
      console.log('Error in wallet:', event.message);
    });
    return new this(page);
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

  async waitForHomePage() {
    await this.page.waitForSelector(this.$homePageBalancesList, { timeout: 30000 });
  }

  async waitForNewPasswordInput() {
    await this.page.waitForSelector(this.$newPasswordInput, { timeout: 30000 });
  }

  async waitForConfirmPasswordInput() {
    await this.page.waitForSelector(this.$confirmPasswordInput, { timeout: 30000 });
  }

  async waitForEnterPasswordInput() {
    await this.page.waitForSelector(this.$enterPasswordInput, { timeout: 30000 });
  }

  async waitForMainHomePage() {
    await this.page.waitForSelector(this.homePage, { timeout: 30000 });
  }

  async waitForHiroWalletLogo() {
    await this.page.waitForSelector(this.$hiroWalletLogo, { timeout: 3000 });
  }

  async waitForLoginPage() {
    await this.page.waitForSelector(this.$signInButton, { timeout: 3000 });
  }

  async waitForStatusMessage() {
    await this.page.waitForSelector(this.$statusMessage, { timeout: 20000 });
  }

  async loginWithPreviousSecretKey(secretKey: string) {
    await this.enterSecretKey(secretKey);
    await this.enterNewPassword();
    await this.enterConfirmPasswordAndClickDone();
  }

  async enterSecretKey(secretKey: string) {
    await this.page.waitForSelector('textarea');
    await this.page.fill('textarea', secretKey);
    await this.page.click(this.$buttonSignInKeyContinue);
  }

  async getSecretKey() {
    await this.goToSecretKey();
    await this.page.waitForSelector(this.$secretKey);
    const secretKeyWords = await this.page.locator(this.$secretKey).allInnerTexts();
    return secretKeyWords.join(' ');
  }

  async backUpKeyAndSetPassword() {
    await this.page.click(this.$confirmBackedUpSecretKey);
    await this.enterNewPassword();
    await this.enterConfirmPasswordAndClickDone();
    await wait(1000);
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
      password ?? this.password
    );
  }

  async enterConfirmPasswordAndClickDone(password?: string) {
    await this.page.fill(
      `input[data-testid=${OnboardingSelectors.ConfirmPasswordInput}]`,
      password ?? this.password
    );
    await this.page.click(this.setPasswordDone);
  }

  async enterPasswordAndUnlockWallet(password?: string) {
    await this.page.fill(
      `input[data-testid=${SettingsSelectors.EnterPasswordInput}]`,
      password ?? this.password
    );
    await this.page.click(this.$unlockWalletBtn);
  }

  async decryptRecoveryCode(password: string) {
    await this.page.fill('input[type="password"]', password);
    await this.page.click(createTestSelector('decrypt-recovery-button'));
  }

  async goToSendForm() {
    await this.page.click(this.sendTokenBtnSelector);
  }

  async goToBuyForm() {
    await this.page.click(this.buyTokenBtnSelector);
  }

  async waitForMagicRecoveryMessage() {
    await this.page.waitForSelector(this.$magicRecoveryMessage, { timeout: 30000 });
  }

  /** Sign up with a randomly generated seed phrase */
  async signUp() {
    await this.clickAllowAnalytics();
    await this.clickSignUp();
    await this.backUpKeyAndSetPassword();
    await this.waitForMainHomePage();
  }

  async signIn(secretKey: string) {
    await this.clickAllowAnalytics();
    await this.clickSignIn();
    let startTime = new Date();
    await this.enterSecretKey(secretKey);
    await this.waitForNewPasswordInput();
    await this.waitForConfirmPasswordInput();
    console.log(
      `Page load time for 12 or 24 word Secret Key: ${timeDifference(
        startTime,
        new Date()
      )} seconds`
    );
    const password = randomString(15);
    startTime = new Date();
    await this.enterNewPassword(password);
    await this.enterConfirmPasswordAndClickDone(password);
    await this.waitForMainHomePage();
    console.log(
      `Page load time for sign in with password: ${timeDifference(startTime, new Date())} seconds`
    );
    startTime = new Date();
    await this.waitForHomePage();
    console.log(
      `Page load time for mainnet account: ${timeDifference(startTime, new Date())} seconds`
    );
  }
}
