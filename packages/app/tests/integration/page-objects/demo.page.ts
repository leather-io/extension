import { createTestSelector } from '../utils';
import { Page } from 'playwright-core/lib/page';
import { Browser } from 'playwright-core/lib/browser';

export class DemoPageObject {
  private page: Page;
  private browser: Browser;
  $openAuthButton = createTestSelector('button-open-connect-modal');
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
  openConnectBtn = 'text="Open Connect"';
  openSignInBtn = 'text="Sign In"';

  constructor(page: Page, browser: Browser) {
    this.page = page;
    this.browser = browser;
  }

  async doLogout() {
    console.log('start logout');
    // eslint-disable-next-line no-use-before-define
    await new Promise(resolve => setTimeout(resolve, 3000));
    await this.page.click(this.profileBtn);
    // eslint-disable-next-line no-use-before-define
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.page.click(this.logoutBtn);
    const el = await this.page.waitForSelector(this.getStarted, { waitFor: 'visible' });
    expect(el).toBeTruthy();
    console.log('logout finished');
  }

  async waitToBeLoggedIn() {
    return await this.page.waitForSelector(this.profileBtn, { timeout: 60000 });
  }

  async clickSkip() {
    await this.page.waitForSelector(this.skipBtn, { timeout: 60000 });
    await this.page.click(this.skipBtn);
  }

  async sendPost(text: string) {
    console.log('start sending post');
    try {
      await this.page.waitForSelector(this.postTextarea, { timeout: 10000 });
      // eslint-disable-next-line no-use-before-define
      await new Promise(resolve => setTimeout(resolve, 5000));
      const randomPost = `Test body content ${text}`;
      await this.page.click(this.postTextarea);
      await this.page.keyboard.sendCharacters(randomPost);
      // eslint-disable-next-line no-use-before-define
      await new Promise(resolve => setTimeout(resolve, 2000));
      await this.page.click(this.postBtn);
      console.log('post sent');
      return this.page.waitForSelector(`//span[text()="${randomPost}"]`);
    } catch (error) {
      await this.page.screenshot({
        path: `smoke-${new Date().valueOf()}.png`,
      });
      throw error;
    }
  }

  /**
   * Explicitly set the return type here to prevent the primitive being lost when using new
   * @return {Page} from 'playwright-core/lib/page';
   */
  async clickAlreadyHaveSecretKey() {
    return this.page.click(this.alreadyHaveSecretKeyLink);
  }

  async getNewWindowPage() {
    await new Promise(resolve => setTimeout(resolve, 5000));
    return this.browser
      .contexts()[0]
      .pages()
      .then(response => {
        return response[1];
      });
  }

  async openConnect() {
    return this.page.click(this.openConnectBtn);
  }

  async openSignIn() {
    return this.page.click(this.openSignInBtn);
  }

  async clickPopUpGetStarted() {
    return this.page.click(this.getStartedPopUp);
  }
}
