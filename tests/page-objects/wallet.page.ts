import { RouteUrls } from '@shared/route-urls';

import { Page } from 'playwright-core';
import { InitialPageSelectors } from '@tests/integration/initial-page.selectors';
import { HomePageSelectors } from '@tests/page-objects/home-page.selectors';
import { SettingsSelectors } from '@tests/integration/settings.selectors';

import {
  createTestSelector,
  wait,
  BrowserDriver,
  randomString,
  timeDifference,
} from '../integration/utils';
import { WalletPageSelectors } from './wallet.selectors';
import { OnboardingSelectors } from '@tests/integration/onboarding.selectors';

export class WalletPage {
  static url = 'http://localhost:8081/index.html#';
  $signUpButton = createTestSelector(InitialPageSelectors.SignUp);
  $signInButton = createTestSelector(InitialPageSelectors.SignIn);
  $analyticsAllowButton = createTestSelector(InitialPageSelectors.AnalyticsAllow);
  homePage = createTestSelector('home-page');
  $textareaReadOnlySeedPhrase = `${createTestSelector('textarea-seed-phrase')}[data-loaded="true"]`;
  $buttonSignInKeyContinue = createTestSelector('sign-in-key-continue');
  setPasswordDone = createTestSelector('set-password-done');
  passwordInput = createTestSelector(OnboardingSelectors.SetOrEnterPasswordInput);
  saveKeyButton = createTestSelector('save-key');
  sendTokenBtnSelector = createTestSelector(WalletPageSelectors.BtnSendTokens);
  confirmSavedKey = createTestSelector('confirm-saved-key');
  lowerCharactersErrMsg =
    'text="You can only use lowercase letters (a–z), numbers (0–9), and underscores (_)."';
  signInKeyError = createTestSelector('sign-in-seed-error');
  password = 'mysecretreallylongpassword';
  $settingsButton = createTestSelector('menu-button');
  $settingsViewSecretKey = createTestSelector('settings-view-secret-key');
  $homePageBalancesList = createTestSelector(HomePageSelectors.BalancesList);
  $createAccountButton = createTestSelector(SettingsSelectors.BtnCreateAccount);
  $createAccountDone = createTestSelector(SettingsSelectors.BtnCreateAccountDone);
  $hiroWalletLogo = createTestSelector(OnboardingSelectors.HiroWalletLogoRouteToHome);
  $signOutConfirmHasBackupCheckbox = createTestSelector(
    SettingsSelectors.SignOutConfirmHasBackupCheckbox
  );
  $signOutDeleteWalletBtn = createTestSelector(SettingsSelectors.BtnSignOutActuallyDeleteWallet);

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

  async clickAllowAnalytics() {
    await this.page.click(this.$analyticsAllowButton);
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

  async waitForHomePage() {
    await this.page.waitForSelector(this.$homePageBalancesList, { timeout: 30000 });
  }

  async waitForSetOrEnterPasswordInput() {
    await this.page.waitForSelector(this.passwordInput, { timeout: 30000 });
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

  async loginWithPreviousSecretKey(secretKey: string) {
    await this.enterSecretKey(secretKey);
    await this.enterPassword();
  }

  async enterSecretKey(secretKey: string) {
    await this.page.waitForSelector('textarea');
    await this.page.fill('textarea', secretKey);
    await this.page.click(this.$buttonSignInKeyContinue);
  }

  async getSecretKey() {
    await this.goToSecretKey();
    await this.page.waitForSelector(this.$textareaReadOnlySeedPhrase);
    const $secretKeyEl = await this.page.$(this.$textareaReadOnlySeedPhrase);
    if (!$secretKeyEl) {
      throw 'Could not find secret key field';
    }
    const secretKey = await $secretKeyEl.textContent();
    if (!secretKey) throw 'No secret key content.';
    return secretKey;
  }

  async saveKey() {
    await this.page.click(this.confirmSavedKey);
    await this.enterPassword();
    await wait(1000);
  }

  async goTo(path: RouteUrls) {
    await this.page.evaluate(`location.hash = '${path}'`);
  }

  async goToSecretKey() {
    await this.clickSettingsButton();
    await this.page.click(this.$settingsViewSecretKey);
  }

  async enterPassword(password?: string) {
    await this.page.fill('input[type="password"]', password ?? this.password);
    await this.page.click(this.setPasswordDone);
  }

  async decryptRecoveryCode(password: string) {
    await this.page.fill('input[type="password"]', password);
    await this.page.click(createTestSelector('decrypt-recovery-button'));
  }

  async goToSendForm() {
    await this.page.click(this.sendTokenBtnSelector);
  }

  /** Sign up with a randomly generated seed phrase */
  async signUp() {
    await this.clickSignUp();
    await this.saveKey();
    await this.waitForHomePage();
  }

  async signIn(secretKey: string) {
    await this.clickSignIn();
    let startTime = new Date();
    await this.enterSecretKey(secretKey);
    await this.waitForSetOrEnterPasswordInput();
    console.log(
      `Page load time for 12 or 24 word Secret Key: ${timeDifference(
        startTime,
        new Date()
      )} seconds`
    );
    const password = randomString(15);
    startTime = new Date();
    await this.enterPassword(password);
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
