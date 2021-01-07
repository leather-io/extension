import { ScreenPaths } from '@store/onboarding/types';
import { Page, BrowserContext } from 'playwright-core';
import { createTestSelector, wait } from '../utils';

export class InstallPage {
  static url = 'http://localhost:8081/#/installed';
  $signUpButton = createTestSelector('sign-up');
  $signInButton = createTestSelector('sign-in');
  $firstAccount = createTestSelector('account-index-0');
  $finishedPage = createTestSelector('install-finished');
  $textareaReadOnlySeedPhrase = `${createTestSelector('textarea-seed-phrase')}[data-loaded="true"]`;
  $buttonSignInKeyContinue = createTestSelector('sign-in-key-continue');
  setPasswordDone = createTestSelector('set-password-done');
  passwordInput = createTestSelector('set-password');
  saveKeyButton = createTestSelector('save-key');
  confirmSavedKey = createTestSelector('confirm-saved-key');
  password = 'mysecretpassword';
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async init(context: BrowserContext) {
    const page = await context.newPage();
    await page.goto(this.url);
    return new this(page);
  }

  async clickSignUp() {
    await this.page.click(this.$signUpButton);
  }

  async clickSignIn() {
    await this.page.click(this.$signInButton);
  }

  async waitForFinishedPage() {
    await this.page.waitForSelector(this.$finishedPage, { timeout: 5000 });
  }

  async loginWithPreviousSecretKey(secretKey: string) {
    await this.page.waitForSelector('textarea');
    await this.page.type('textarea', secretKey);
    await this.page.click(this.$buttonSignInKeyContinue);
    await this.enterPassword();
    await this.waitForFinishedPage();
  }

  async getSecretKey() {
    await this.goToSecretKey();
    await this.page.waitForSelector(this.$textareaReadOnlySeedPhrase);
    const $secretKeyEl = await this.page.$(this.$textareaReadOnlySeedPhrase);
    if (!$secretKeyEl) {
      throw 'Could not find secret key field';
    }
    const secretKey = (await this.page.$eval(
      this.$textareaReadOnlySeedPhrase,
      (el: HTMLTextAreaElement) => el.value
    )) as string;
    return secretKey;
  }

  async saveKey() {
    await this.page.click(this.saveKeyButton);
    await this.page.click(this.confirmSavedKey);
    await this.enterPassword();
    await wait(1000);
  }

  async goTo(path: ScreenPaths) {
    await this.page.evaluate(`location.hash = '${path}'`);
  }

  async goToSecretKey() {
    await this.goTo(ScreenPaths.SETTINGS_KEY);
  }

  async enterPassword() {
    await this.page.fill(this.passwordInput, this.password);
    await this.page.click(this.setPasswordDone);
  }
}
