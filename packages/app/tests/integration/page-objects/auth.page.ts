import { createTestSelector } from '../utils';
import { Page } from 'playwright-core/lib/page';
import { Browser } from 'playwright-core/lib/browser';

export class AuthPageObject {
  $buttonCopySecretKey = createTestSelector('button-copy-secret-key');
  $buttonHasSavedSeedPhrase = createTestSelector('button-has-saved-seed-phrase');
  $inputUsername = createTestSelector('input-username');
  $buttonUsernameContinue = createTestSelector('button-username-continue');
  $textareaReadOnlySeedPhrase = createTestSelector('textarea-seed-phrase');
  $buttonConfirmReenterSeedPhrase = createTestSelector('button-confirm-reenter-seed-phrase');
  $textareaSeedPhraseInput = createTestSelector('textarea-reinput-seed-phrase');
  $buttonConnectFlowFinished = createTestSelector('button-connect-flow-finished');
  onboardingSignIn = '#onboarding-sign-in';
  eightCharactersErrMsg = 'text="Your username should be at least 8 characters, with a maximum of 37 characters."';
  lowerCharactersErrMsg = 'text="You can only use lowercase letters (a–z), numbers (0–9), and underscores (_)."';
  iHaveSavedIt = 'text="I\'ve saved it"';
  passwordInput = '//input[@type="password"]';
  addNewAccountLink = '//span[text()="Add a new account"]';
  invalidSecretKey = 'text="The Secret Key you\'ve entered is invalid"';
  incorrectPassword = 'text="Incorrect password"';

  continueBtn = 'text="Continue"';

  private page: Page;
  private browser: Browser;

  //TODO: Please set correct page!
  constructor(page: Page, browser: Browser) {
    this.page = page;
    this.browser = browser;
  }

  async saveSecretPhrase() {
    try {
      await this.page.waitForSelector(this.$textareaReadOnlySeedPhrase);
    } catch (error) {
      await this.page.screenshot({
        path: `smoke-${new Date().valueOf()}.png`,
      });
      throw error;
    }
    const secretKey = await this.page.$eval(this.$textareaReadOnlySeedPhrase, element => element.value);
    await this.page.click(this.$buttonCopySecretKey);
    await this.page.waitForSelector(this.$buttonHasSavedSeedPhrase);
    await this.page.click(this.$buttonHasSavedSeedPhrase);
    return secretKey;
  }

  async setUserName(text: string) {
    await this.page.waitForSelector(this.$inputUsername);
    await this.page.type(this.$inputUsername, text);
    await this.page.click(this.$buttonUsernameContinue);
  }

  async loginWithPreviosCreatedUser(text: string) {
    await this.page.click(`//span[text()="${text}"]`);
  }

  async createNewAccount(username: string) {
    await this.page.click(this.addNewAccountLink);
    await this.setUserName(username);
  }

  async loginWithPreviousSecretKey(secretKey: string) {
    await this.page.type('textarea', secretKey);
    await this.page.click(this.continueBtn);
  }

  async setPassword(password: string) {
    await this.page.type(this.passwordInput, password);
    await this.page.click(this.continueBtn);
  }

  async chooseAccount(username: string) {
    return this.page.click(`text="${username}"`);
  }

  async clickIhaveSaveIt() {
    let error;
    await this.page.waitForSelector(this.iHaveSavedIt, { timeout: 3000 }).catch(e => (error = e));
    if (error == null) {
      await this.page.click(this.iHaveSavedIt);
    }
  }
}
