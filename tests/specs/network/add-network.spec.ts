import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { test } from '../../fixtures/fixtures';

test.describe('Networks tests', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, homePage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.clickSettingsButton();
    await page.getByTestId(SettingsSelectors.ChangeNetworkAction).click();
    await page.getByTestId(SettingsSelectors.BtnAddNetwork).click();
  });

  test('validation error when address is empty', async ({ networkPage }) => {
    await networkPage.clickAddNetwork();
    await networkPage.waitForErrorMessage();

    const errorMsgElement = await networkPage.getErrorMessage();
    const errorMessage = await errorMsgElement.innerText();
    test.expect(errorMessage).toEqual(NetworkSelectors.EmptyAddressError);
  });

  test('unable to fetch info from node', async ({ networkPage }) => {
    await networkPage.inputNetworkAddressField('https://www.google.com/');
    await networkPage.inputNetworkKeyField('test-network');
    await networkPage.clickAddNetwork();
    await networkPage.waitForErrorMessage();
    const errorMsgElement = await networkPage.getErrorMessage();
    const errorMessage = await errorMsgElement.innerText();
    test.expect(errorMessage).toEqual(NetworkSelectors.NoNodeFetch);
  });
});
