import { Page, BrowserContext } from 'playwright-core';
import { createTestSelector } from '../utils';

export class InstallPage {
  static url = 'http://localhost:8080/#/installed';
  $signUpButton = createTestSelector('sign-up');
  $signInButton = createTestSelector('sign-in');
  $firstAccount = createTestSelector('account-index-0');
  $finishedPage = createTestSelector('install-finished');
  $textareaReadOnlySeedPhrase = `${createTestSelector('textarea-seed-phrase')}[data-loaded="true"]`;
  $buttonSignInKeyContinue = createTestSelector('sign-in-key-continue');
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
    await this.page.waitForSelector(this.$finishedPage);
  }

  async loginWithPreviousSecretKey(secretKey: string) {
    await this.page.waitForSelector('textarea');
    await this.page.type('textarea', secretKey);
    await this.page.click(this.$buttonSignInKeyContinue);
    await this.waitForFinishedPage();
  }

  async getSecretKey() {
    await this.page.goto('http://localhost:8080/#/settings/secret-key');
    await this.page.waitForSelector(this.$textareaReadOnlySeedPhrase);
    const $secretKeyEl = await this.page.$(this.$textareaReadOnlySeedPhrase);
    if (!$secretKeyEl) {
      throw 'Could not find secret key field';
    }
    const secretKey = (await this.page.evaluate(el => el.textContent, $secretKeyEl)) as string;
    return secretKey;
  }
}
