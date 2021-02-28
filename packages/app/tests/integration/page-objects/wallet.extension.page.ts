import { Page } from 'playwright-core';

export class WalletExtensionPage {
  signUpBtn = '[data-test="sign-up"]';
  confirmSavedBtn = '[data-test="confirm-saved-key"]';
  secretKeyEl = '[data-test="textarea-seed-phrase"]';
  passwordInput = '[data-test="set-password"]';
  doneBtn = '[data-test="set-password-done"]';
  signInLink = 'text="Sign in"';
  signOutLink = 'text="Sign Out"';
  lockLink = 'text="Lock"';

  // [data-test] selector is required for menuBtn
  menuBtn = '//*[@data-test="container-outer"]/div[2]/div[4]';

  continueWithKeyLink = 'text="Continue with Secret Key"';
  secretKeyInput = '[placeholder="Enter your Secret Key"]';

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getSecretKey() {
    await this.page.waitForSelector('text="Save your Secret Key"', { timeout: 10000 });
    const secretKey = (await this.page.$eval(this.secretKeyEl, el => el.textContent)) as string;
    return secretKey;
  }

  async clickConfirmSavedBtn() {
    return this.page.click(this.confirmSavedBtn);
  }

  async clickSignUpBtn() {
    return this.page.click(this.signUpBtn);
  }

  async setPassword(password: string) {
    await this.page.fill(this.passwordInput, password);
    return this.page.click(this.doneBtn);
  }

  async signOut() {
    await this.page.click(this.menuBtn);
    return this.page.click(this.signOutLink);
  }

  async lockAccount() {
    await this.page.click(this.menuBtn);
    return this.page.click(this.lockLink);
  }

  async unlockAccount(password: string) {
    await this.page.fill(this.passwordInput, password);
    return this.page.click(this.doneBtn);
  }

  async logInWithSecretKey(secretKey: string) {
    await this.page.click(this.continueWithKeyLink);
    await this.page.fill(this.secretKeyInput, secretKey);
    return this.page.click(this.signInLink);
  }

  async checkAccountFields() {
    await this.page.waitForSelector('text="Tokens"', { timeout: 10000 });
    expect(await this.page.$('text="Send"')).not.toBeNull();
    expect(await this.page.$('text="Receive"')).not.toBeNull();
    expect(await this.page.$('text="Buy Stacks Token"')).not.toBeNull();
  }
}
