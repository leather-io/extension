import { validateMnemonic } from 'bip39';

describe('Authentication', () => {
  it('can open the auth window', async () => {
    await page.goto('http://localhost:3001');
    await expect(page).toMatch('Open Authentication');
    await page.click('#auth-action');
    const newWindow = await browser.waitForTarget(target =>
      target.url().startsWith('http://localhost:8080')
    );
    const authPage = await newWindow.page();

    expect(authPage.url().startsWith('http://localhost:8080')).toBeTruthy();
    await authPage.waitFor('#create-data-vault-button');

    expect(authPage).toMatch('Tester-Fake-App');
    const appIcon = await authPage.$('#app-icon-img');
    const iconSrc = await authPage.evaluate(el => el.src, appIcon);
    expect(iconSrc).toEqual('http://localhost:3001/logo512.png');

    await authPage.click('#create-data-vault-button');
    await authPage.waitFor('#copy-secret-key-button');

    const secretKeyEl = await authPage.$('#secret-key-field');
    if (!secretKeyEl) {
      throw 'Could not find secret key field';
    }
    const secretKey: string = await authPage.evaluate(el => el.value, secretKeyEl);
    expect(secretKey.split(' ').length).toEqual(12);
    expect(validateMnemonic(secretKey)).toBeTruthy();

    await authPage.click('#copy-secret-key-button');
    await authPage.waitFor('#saved-key-button');
    await authPage.click('#saved-key-button');
    await authPage.waitFor('#connect-page-continue-button');
    await authPage.type('#secret-key-field', secretKey);
    await authPage.click('#connect-page-continue-button');
    await authPage.waitFor('#done-auth-button');
    await authPage.click('#done-auth-button');

    await page.waitFor('#auth-response');
    const authResponseEl = await page.$('#auth-response');
    const authResponse: string = await page.evaluate(
      el => el.innerText,
      authResponseEl
    );
    expect(authResponse).toBeTruthy();
  }, 70000);
});
