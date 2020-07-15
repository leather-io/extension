import { Page } from 'playwright-core';
import { BrowserContext } from 'playwright-core';
import { createTestSelector } from '../utils';

export class DemoPage {
  static url = 'http://localhost:3000';
  $openAuthButton = createTestSelector('button-skip-connect');
  authResponse = '#auth-response';
  appPriivateKey = '#app-private-key';
  getStarted = '//span[text()="Get Started"]';
  getStartedPopUp = 'css=button>span >> text="Get started"';
  skipBtn = 'text="Skip"';
  postTextarea = 'div.DraftEditor-root';
  postBtn = '//span[text()="Post"]';
  profileBtn = '//*[@title="Your Profile"]';
  logoutBtn = '//*[contains(text(),"Log out")]';
  alreadyHaveSecretKeyLink = '//span[text()="I already have a Secret Key"]';
  openConnectBtn = createTestSelector('sign-up');
  openSignInBtn = createTestSelector('sign-in');
  statusInput = createTestSelector('status-input');
  submitStatusButton = createTestSelector('submit-write-status');
  submitStatusTxid = createTestSelector('submit-status-txid');

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async init(context: BrowserContext) {
    const page = await context.newPage();
    await page.goto(this.url);
    return new this(page);
  }

  // /**
  //  * Explicitly set the return type here to prevent the primitive being lost when using new
  //  * @return {Page} from 'playwright-core/lib/page';
  //  */
  clickAlreadyHaveSecretKey() {
    return this.page.click(this.alreadyHaveSecretKeyLink);
  }

  async goToPage() {
    // return
  }

  openConnect() {
    return this.page.click(this.openConnectBtn);
  }

  async waitForAuthResponse() {
    await this.page.waitForSelector('#auth-response', { state: 'attached', timeout: 15000 });
    const authResponseEl = await this.page.$('#auth-response');
    const authResponse = (await this.page.evaluate(
      el => el?.getAttribute('value'),
      authResponseEl
    )) as string;
    return authResponse;
  }

  async getSTXAddress() {
    await this.page.waitForSelector('#user-stx-address', { state: 'attached', timeout: 15000 });
    const stxAddressEl = await this.page.$('#user-stx-address');
    const stxAddress = (await this.page.evaluate(
      el => el?.getAttribute('value'),
      stxAddressEl
    )) as string;
    return stxAddress;
  }

  async getStatusTxid() {
    await this.page.waitForSelector(this.submitStatusTxid);
    const txidEl = await this.page.$(this.submitStatusTxid);
    const txid = (await this.page.evaluate(el => el?.getAttribute('data-txid'), txidEl)) as string;
    return txid;
  }

  clickConnectGetStarted() {
    return this.page.click(this.getStartedPopUp);
  }
}
