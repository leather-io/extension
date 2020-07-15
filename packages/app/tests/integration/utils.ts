export { Browser } from 'playwright-core';
import { Page, Browser } from 'playwright-core';
import { validateMnemonic, wordlists } from 'bip39';
import { DemoPage } from './page-objects/demo.page';
import { AuthPage } from './page-objects/auth.page';

export function createTestSelector(name: string) {
  return `[data-test="${name}"]`;
}

export function randomString(len: number) {
  const charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export const getRandomWord = () => {
  const list = wordlists.EN;
  const word = list[Math.floor(Math.random() * list.length)];
  return word;
};

export const wait = async (ms: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const authenticate = async (demoPage: DemoPage, browser: Browser) => {
  await demoPage.openConnect();
  await demoPage.clickConnectGetStarted();
  const auth = await AuthPage.getAuthPage(browser);
  const authPage = auth.page;
  await authPage.waitForSelector(auth.$textareaReadOnlySeedPhrase);
  await authPage.click(auth.$buttonCopySecretKey);

  await authPage.waitForSelector(auth.$buttonHasSavedSeedPhrase);
  await authPage.click(auth.$buttonHasSavedSeedPhrase);
  await authPage.type(
    auth.$inputUsername,
    `${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`
  );
  await authPage.click(auth.$buttonUsernameContinue);

  await demoPage.waitForAuthResponse();
}

export const login = async (demoPage: DemoPage, browser: Browser) => {
  const SECRET_KEY = 'invite helmet save lion indicate chuckle world pride afford hard broom draft';
  const USERNAME = 'thisis45678';
  await demoPage.openConnect();
  await demoPage.clickAlreadyHaveSecretKey();
  const authPage = await AuthPage.getAuthPage(browser, false);
  await authPage.loginWithPreviousSecretKey(SECRET_KEY);
  await authPage.chooseAccount(USERNAME);
  await demoPage.waitForAuthResponse();
}

export const debug = async (page: Page) => {
  // this.setTimeout(345600000);
  // Run a debugger (in case Playwright has been launched with `{ devtools: true }`)
  await page.evaluate(() => {
    // eslint-disable-next-line no-debugger
    debugger;
  });

  const KEYS = {
    CONTROL_C: '\u0003',
    CONTROL_D: '\u0004',
    ENTER: '\r',
  };
  console.log('\n\n🕵️‍  Code is paused, press enter to resume');
  // Run an infinite promise
  return new Promise(resolve => {
    const { stdin } = process;
    const listening = stdin.listenerCount('data') > 0;
    const onKeyPress = (key: string): void => {
      if (key === KEYS.CONTROL_C || key === KEYS.CONTROL_D || key === KEYS.ENTER) {
        stdin.removeListener('data', onKeyPress);
        if (!listening) {
          if (stdin.isTTY) {
            stdin.setRawMode(false);
          }
          stdin.pause();
        }
        resolve();
      }
    };
    if (!listening) {
      if (stdin.isTTY) {
        stdin.setRawMode(true);
      }
      stdin.resume();
      stdin.setEncoding('utf8');
    }
    stdin.on('data', onKeyPress);
  });
};
