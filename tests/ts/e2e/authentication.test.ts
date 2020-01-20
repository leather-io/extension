import { validateMnemonic, generateMnemonic } from 'bip39';
import { Wallet } from '@blockstack/keychain';

import { AuthPageObject } from './auth.page';
import { DemoPageObject } from './demo.page';

describe('Authentication', () => {
  let authPageObject: AuthPageObject;
  let demoPageObject: DemoPageObject;

  beforeEach(async () => {
    await jestPuppeteer.resetBrowser();
    authPageObject = new AuthPageObject();
    demoPageObject = new DemoPageObject();
  });

  test.only('creating a successful account', async done => {
    await demoPageObject.goToFreshPage();
    await page.click(demoPageObject.$openAuthButton);

    const newWindow = await browser.waitForTarget(target => target.url().startsWith(authPageObject.url));
    const authPage = await newWindow.page();

    expect(authPage.url().startsWith(authPageObject.url)).toBeTruthy();

    // await authPage.waitFor('#create-data-vault-button', { timeout: 60_000 });

    // await expect(authPage).toMatch('Tester-Fake-App');
    // const appIcon = await authPage.$('#app-icon-img');
    // const iconSrc = await authPage.evaluate(el => el.src, appIcon);
    // expect(iconSrc).toEqual(demoPageObject.url + '/logo512.png');

    // await authPage.click('#create-data-vault-button');
    await authPage.waitFor('[data-test="button-copy-secret-key"]');

    const secretKeyEl = await authPage.$('[data-test="textarea-seed-phrase"]');
    if (!secretKeyEl) {
      throw 'Could not find secret key field';
    }
    const secretKey: string = await authPage.evaluate(el => el.value, secretKeyEl);
    expect(secretKey.split(' ').length).toEqual(12);
    expect(validateMnemonic(secretKey)).toBeTruthy();

    await authPage.click('[data-test="button-copy-secret-key"]');

    await authPage.waitFor('[data-test="button-has-saved-seed-phrase"]');
    await authPage.click('[data-test="button-has-saved-seed-phrase"]');

    await authPage.waitFor('[data-test="button-confirm-reenter-seed-phrase"]');
    await authPage.type('[data-test="textarea-reinput-seed-phrase"]', secretKey);
    await authPage.click('[data-test="button-confirm-reenter-seed-phrase"]');

    await authPage.waitFor('[data-test="button-connect-flow-finished"]');

    await expect(authPage).toMatch('You\’re all set!');

    await authPage.click('[data-test="button-connect-flow-finished"]');

    await page.waitFor('#auth-response');
    const authResponseEl = await page.$('#auth-response');
    const authResponse: string = await page.evaluate(el => el.innerText, authResponseEl);
    expect(authResponse).toBeTruthy();
    done();
  }, 150_000);

  test('that it does not let you proceed when passing an incorrect seed phrase', async done => {
    await demoPageObject.goToFreshPage();
    await page.click(demoPageObject.$openAuthButton);

    const newWindow = await browser.waitForTarget(target => target.url().startsWith(authPageObject.url));
    const authPage = await newWindow.page();

    expect(authPage.url().startsWith(authPageObject.url)).toBeTruthy();

    await authPage.waitFor('#create-data-vault-button');
    await authPage.click('#create-data-vault-button');
    await authPage.waitFor('[data-test="button-copy-secret-key"]');

    const secretKeyEl = await authPage.$('[data-test="textarea-reinput-seed-phrase"]');
    if (!secretKeyEl) {
      throw 'Could not find secret key field';
    }
    const secretKey: string = await authPage.evaluate(el => el.value, secretKeyEl);
    expect(secretKey.split(' ').length).toEqual(12);
    expect(validateMnemonic(secretKey)).toBeTruthy();

    await authPage.click('[data-test="button-copy-secret-key"]');
    await authPage.waitFor('[data-test="button-has-saved-seed-phrase"]');
    await authPage.click('[data-test="button-has-saved-seed-phrase"]');
    await authPage.waitFor('[data-test="button-confirm-reenter-seed-phrase"]');
    await authPage.type('[data-test="textarea-reinput-seed-phrase"]', 'kljasdlfkjalsdjfkas');
    await authPage.click('[data-test="button-confirm-reenter-seed-phrase"]');
    await expect(authPage).toMatch(`You're all set!`);
    done();
  }, 150_000);

  test('signing in with an existing seed phrase', async () => {
    await demoPageObject.goToFreshPage();
    await page.click(demoPageObject.$openAuthButton);
    const newWindow = await browser.waitForTarget(target => target.url().startsWith(authPageObject.url));
    const authPage = await newWindow.page();

    expect(authPage.url().startsWith(authPageObject.url)).toBeTruthy();

    await authPage.waitFor('#onboarding-sign-in');
    await authPage.click('#onboarding-sign-in');
    const seed = generateMnemonic();
    const wallet = await Wallet.restore('password', seed);
    await authPage.type('[data-test="textarea-reinput-seed-phrase"]', seed);
    await authPage.click('#sign-in-continue');

    await page.waitFor('#auth-response');
    const authResponseEl = await page.$('#auth-response');
    const authResponse: string = await page.evaluate(el => el.innerText, authResponseEl);
    expect(authResponse).toBeTruthy();

    const appPrivateKeyEl = await page.$('#app-private-key');
    const appPrivateKey: string = await page.evaluate(el => el.innerText, appPrivateKeyEl);
    expect(appPrivateKey).toBeTruthy();
    expect(appPrivateKey).toEqual(await wallet.identities[0].appPrivateKey(demoPageObject.url));
  }, 150_000);
});
