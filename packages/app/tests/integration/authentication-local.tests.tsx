import { Wallet } from '@blockstack/keychain';
import { validateMnemonic, generateMnemonic, wordlists } from 'bip39';

import { devices, chromium, webkit } from 'playwright-core';
import { DemoPageObject } from './page-objects/demo.page';
import { createTestSelector, randomString } from './utils';
import { AuthPageObject } from './page-objects/auth.page';

const iPhone11 = devices['iPhone 11 Pro'];
const pixel2 = devices['Pixel 2'];
const URL = 'http://localhost:3000';
const SECRET_KEY = 'invite helmet save lion indicate chuckle world pride afford hard broom draft';
const WRONG_SECRET_KEY = 'invite helmet save lion indicate chuckle world pride afford hard broom yup';
const WRONG_MAGIC_RECOVERY_KEY =
  'KDR6O8gKXGmstxj4d2oQqCi806M/Cmrbiatc6g7MkQQLVreRA95IoPtvrI3N230jTTGb2XWT5joRFKPfY/2YlmRz1brxoaDJCNS4z18Iw5Y=';
const WRONG_PASSWORD = 'sstest202020';
const CORRECT_PASSWORD = 'test202020';
const USERNAME = 'thisis45678';

let authPageObject: AuthPageObject;
let demoPageObject: DemoPageObject;

const SEED_PHRASE_LENGTH = 12;
let browser;
let page;
let context;

async function openGetStartedBunterPage(page, demoPageObject, auth, isNewAccount: boolean) {
  await page.goto(URL);
  await page.click(demoPageObject.getStarted);
  await page.click(demoPageObject.getStartedPopUp);

  let backgroundPage;
  if (browser.constructor.name != 'CRBrowser') {
    // eslint-disable-next-line no-use-before-define
    await new Promise(resolve => setTimeout(resolve, 5000));
    backgroundPage = await browser
      .contexts()[0]
      .pages()
      .then(response => {
        return response[1];
      });
  } else {
    const target2 = await browser.waitForTarget(target => target.url().startsWith('https://app.blockstack.org'));
    backgroundPage = await target2.page();
  }
  if (isNewAccount) {
    try {
      await backgroundPage.waitForSelector(auth.$textareaReadOnlySeedPhrase);
    } catch (error) {
      await backgroundPage.screenshot({
        path: `smoke-${'chromium'}-${new Date().valueOf()}.png`,
      });
      throw error;
    }
  }
  return backgroundPage;
}

const getRandomWord = () => {
  const list = wordlists.EN;
  const word = list[Math.floor(Math.random() * list.length)];
  return word;
};

describe.each([
  [chromium, ''],
  [webkit, ''],
  [webkit, iPhone11],
  [chromium, pixel2],
])('Authentication' + ' run with (%o, %o)', (browserType, deviceType) => {
  beforeEach(async () => {
    console.log(browserType);
    browser = await browserType.launch({ headless: false });
    if (deviceType == '') {
      context = await browser.newContext();
    } else {
      context = await browser.newContext({
        viewport: deviceType.viewport,
        userAgent: deviceType.userAgent,
      });
    }
    page = await context.newPage();
    await page.goto(URL);
    authPageObject = new AuthPageObject(page, browser);
    demoPageObject = new DemoPageObject(page, browser);
  });

  afterEach(async () => {
    await browser.close();
  });

  // afterAll(async () => {
  //   await browser.close();
  // });

  it('creating a successful local account', async () => {
    await demoPageObject.openConnect();
    await demoPageObject.clickPopUpGetStarted();
    const backgroundPage = await demoPageObject.getNewWindowPage();
    authPageObject = new AuthPageObject(backgroundPage, browser);
    const secretKey = await authPageObject.saveSecretPhrase();
    expect(secretKey.split(' ').length).toEqual(SEED_PHRASE_LENGTH);
    expect(validateMnemonic(secretKey)).toBeTruthy();
    await authPageObject.clickIhaveSaveIt();
    await authPageObject.setUserName(`${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`);
    await backgroundPage.click(authPageObject.$buttonUsernameContinue);
    const authResponse = await page.waitForSelector(demoPageObject.getStartedPopUp, {
      timeout: 60000,
      waitFor: 'hidden',
    });
    expect(authResponse).toBeTruthy();
  }, 90000);

  it('creating an account - negative scenarious', async () => {
    await demoPageObject.openConnect();
    await demoPageObject.clickPopUpGetStarted();
    const backgroundPage = await demoPageObject.getNewWindowPage();
    authPageObject = new AuthPageObject(backgroundPage, browser);
    await authPageObject.saveSecretPhrase();
    await authPageObject.clickIhaveSaveIt();
    backgroundPage.waitForSelector(authPageObject.$inputUsername);

    //TEST1 less than 7
    await backgroundPage.type(authPageObject.$inputUsername, randomString(7));
    await backgroundPage.click(authPageObject.$buttonUsernameContinue);
    let element = await backgroundPage.$(authPageObject.eightCharactersErrMsg);
    expect(element).toBeTruthy();
    await backgroundPage.evaluate(() => {
      const el = document.querySelector('[data-test="input-username"]');
      el.value = '';
    });

    //TEST2 more than 37
    await backgroundPage.type(authPageObject.$inputUsername, randomString(38));
    await backgroundPage.click(authPageObject.$buttonUsernameContinue);
    element = await backgroundPage.$(authPageObject.eightCharactersErrMsg);
    expect(element).toBeTruthy();
    await backgroundPage.evaluate(() => {
      const el = document.querySelector('[data-test="input-username"]');
      el.value = '';
    });

    //TEST3 specal symbols
    await backgroundPage.type(authPageObject.$inputUsername, '!@#$%^&*()-=+/?.>,<`~');
    await backgroundPage.click(authPageObject.$buttonUsernameContinue);
    element = await backgroundPage.$(authPageObject.lowerCharactersErrMsg);
    expect(element).toBeTruthy();
    await backgroundPage.evaluate(() => {
      const el = document.querySelector('[data-test="input-username"]');
      el.value = '';
    });

    //TEST4 UPPERCASE
    await backgroundPage.type(
      authPageObject.$inputUsername,
      `${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`.toUpperCase()
    );
    await backgroundPage.click(authPageObject.$buttonUsernameContinue);
    element = await backgroundPage.$(authPageObject.lowerCharactersErrMsg);
    expect(element).toBeTruthy();
    await backgroundPage.evaluate(() => {
      const el = document.querySelector('[data-test="input-username"]');
      el.value = '';
    });

    //TEST5 with spaces
    await backgroundPage.type(
      authPageObject.$inputUsername,
      `${getRandomWord()} ${getRandomWord()} ${getRandomWord()}_${getRandomWord()}`
    );
    await backgroundPage.click(authPageObject.$buttonUsernameContinue);
    element = await backgroundPage.$(authPageObject.lowerCharactersErrMsg);
    expect(element).toBeTruthy();
    await backgroundPage.evaluate(() => {
      const el = document.querySelector('[data-test="input-username"]');
      el.value = '';
    });
    //TEST6 Name already taken
    await backgroundPage.type(authPageObject.$inputUsername, 'test1234');
    await backgroundPage.click(authPageObject.$buttonUsernameContinue);
    expect(
      await backgroundPage.waitForSelector(
        'text="This username is not available"',
        { waitFor: 'visible' },
        { timeout: 10000 }
      )
    ).toBeTruthy();
    await backgroundPage.evaluate(() => {
      const el = document.querySelector('[data-test="input-username"]');
      el.value = '';
    });
  }, 90000);

  //skipped because it actual only for https://banter.pub/
  it.skip('creating a successful account, make a post', async () => {
    //TEST #7
    let backgroundPage = await openGetStartedBunterPage(page, demoPageObject, authPageObject, true);
    authPageObject = new AuthPageObject(backgroundPage, browser);
    await authPageObject.saveSecretPhrase();
    const username = `${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`;
    await authPageObject.setUserName(username);
    await demoPageObject.clickSkip();
    const isSent2 = await demoPageObject.sendPost(getRandomWord());
    expect(isSent2).toBeTruthy();

    //TEST #8
    await demoPageObject.doLogout();
    backgroundPage = await openGetStartedBunterPage(page, demoPageObject, authPageObject, false);
    authPageObject = new AuthPageObject(backgroundPage, browser);
    await authPageObject.loginWithPreviosCreatedUser(username);
    const el = await demoPageObject.waitToBeLoggedIn();
    expect(el).toBeTruthy();

    //TEST #9
    await demoPageObject.doLogout();
    backgroundPage = await openGetStartedBunterPage(page, demoPageObject, authPageObject, false);
    authPageObject = new AuthPageObject(backgroundPage, browser);
    const newUsername = `${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`;
    await authPageObject.createNewAccount(newUsername);
    await demoPageObject.clickSkip();
    const isSent = await demoPageObject.sendPost(getRandomWord());
    expect(isSent).toBeTruthy();
  }, 90000);

  it('Sign in with existing key', async () => {
    //TEST #10,11
    await demoPageObject.openConnect();
    await demoPageObject.clickAlreadyHaveSecretKey();
    const backgroundPage = await demoPageObject.getNewWindowPage();
    authPageObject = new AuthPageObject(backgroundPage, browser);
    await authPageObject.loginWithPreviousSecretKey(SECRET_KEY);
    await authPageObject.chooseAccount(USERNAME);
    const authResponse = await page.waitForSelector(demoPageObject.getStartedPopUp, {
      timeout: 60000,
      waitFor: 'hidden',
    });
    expect(authResponse).toBeTruthy();
  }, 90000);

  it('Sign in with the wrong key', async () => {
    //TEST #12
    await demoPageObject.openConnect();
    await demoPageObject.clickAlreadyHaveSecretKey();
    const backgroundPage = await demoPageObject.getNewWindowPage();
    authPageObject = new AuthPageObject(backgroundPage, browser);
    await authPageObject.loginWithPreviousSecretKey(WRONG_SECRET_KEY);
    const element = await backgroundPage.$(authPageObject.invalidSecretKey);
    expect(element).toBeTruthy();
  }, 90000);

  it('Sign in with the wrong magic recovery code', async () => {
    //TEST #13
    await demoPageObject.openConnect();
    await demoPageObject.clickAlreadyHaveSecretKey();
    const backgroundPage = await demoPageObject.getNewWindowPage();
    authPageObject = new AuthPageObject(backgroundPage, browser);
    await authPageObject.loginWithPreviousSecretKey(WRONG_MAGIC_RECOVERY_KEY);
    await authPageObject.setPassword(WRONG_PASSWORD);
    const element = await backgroundPage.waitForSelector(authPageObject.incorrectPassword);
    expect(element).toBeTruthy();
  }, 90000);

  it('Sign in with the correct magic recovery code', async () => {
    //TEST #13
    await demoPageObject.openConnect();
    await demoPageObject.clickAlreadyHaveSecretKey();
    const backgroundPage = await demoPageObject.getNewWindowPage();
    authPageObject = new AuthPageObject(backgroundPage, browser);
    await authPageObject.loginWithPreviousSecretKey(WRONG_MAGIC_RECOVERY_KEY);
    await authPageObject.setPassword(CORRECT_PASSWORD);
    await authPageObject.chooseAccount('thisisit202020');
    const authResponse = await page.waitForSelector(demoPageObject.getStartedPopUp, {
      timeout: 60000,
      waitFor: 'hidden',
    });
    expect(authResponse).toBeTruthy();
  }, 90000);
});
