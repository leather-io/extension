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

  test('validation error when stacks api url is empty', async ({ networkPage }) => {
    await networkPage.inputNetworkNameField('Test network');
    await networkPage.inputNetworkStacksAddressField('');
    await networkPage.inputNetworkBitcoinAddressField('https://mempool.space/testnet/api');
    await networkPage.inputNetworkKeyField('test-network');
    await networkPage.clickAddNetwork();
    await networkPage.waitForErrorMessage();

    const errorMsgElement = await networkPage.getErrorMessage();
    const errorMessage = await errorMsgElement.innerText();
    test.expect(errorMessage).toEqual(NetworkSelectors.EmptyStacksAddressError);
  });

  test('validation error when name is empty', async ({ networkPage }) => {
    await networkPage.clickAddNetwork();
    await networkPage.waitForErrorMessage();

    const errorMsgElement = await networkPage.getErrorMessage();
    const errorMessage = await errorMsgElement.innerText();
    test.expect(errorMessage).toEqual(NetworkSelectors.EmptyNameError);
  });
  test('validation error when key is empty', async ({ networkPage }) => {
    await networkPage.inputNetworkNameField('Test network');
    await networkPage.clickAddNetwork();
    await networkPage.waitForErrorMessage();

    const errorMsgElement = await networkPage.getErrorMessage();
    const errorMessage = await errorMsgElement.innerText();
    test.expect(errorMessage).toEqual(NetworkSelectors.EmptyKeyError);
  });

  test('validation error when bitcoin api url is empty', async ({ networkPage }) => {
    await networkPage.inputNetworkNameField('Test network');
    await networkPage.inputNetworkBitcoinAddressField('');
    await networkPage.inputNetworkKeyField('test-network');
    await networkPage.clickAddNetwork();
    await networkPage.waitForErrorMessage();

    const errorMsgElement = await networkPage.getErrorMessage();
    const errorMessage = await errorMsgElement.innerText();
    test.expect(errorMessage).toEqual(NetworkSelectors.EmptyBitcoinURLError);
  });

  test('unable to fetch info from stacks node', async ({ networkPage }) => {
    await networkPage.inputNetworkNameField('Test network');
    await networkPage.inputNetworkStacksAddressField('https://www.google.com/');
    await networkPage.inputNetworkKeyField('test-network');
    await networkPage.clickAddNetwork();
    await networkPage.waitForErrorMessage();

    const errorMsgElement = await networkPage.getErrorMessage();
    const errorMessage = await errorMsgElement.innerText();
    test.expect(errorMessage).toEqual(NetworkSelectors.NoStacksNodeFetch);
  });

  test('unable to fetch mempool from bitcoin node', async ({ networkPage }) => {
    await networkPage.inputNetworkNameField('Test network');
    await networkPage.inputNetworkBitcoinAddressField('https://www.google.com/');
    await networkPage.inputNetworkKeyField('test-network');
    await networkPage.clickAddNetwork();
    await networkPage.waitForErrorMessage();

    const errorMsgElement = await networkPage.getErrorMessage();
    const errorMessage = await errorMsgElement.innerText();
    test.expect(errorMessage).toEqual(NetworkSelectors.NoBitcoinNodeFetch);
  });
});
