import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { BITCOIN_API_BASE_URL_TESTNET3 } from '@leather.io/models';

import { test } from '../../fixtures/fixtures';

test.describe('Networks tests', () => {
  test.beforeEach(
    async ({ extensionId, globalPage, onboardingPage, homePage, networkPage, page }) => {
      await globalPage.setupAndUseApiCalls(extensionId);
      await onboardingPage.signInWithTestAccount(extensionId);
      await homePage.clickSettingsButton();
      await page.getByTestId(SettingsSelectors.ChangeNetworkAction).click();
      await page.getByTestId(SettingsSelectors.AddNewNetworkBtn).click();
      await networkPage.waitForNetworkPageReady();
    }
  );

  test('that bitcoin api url changes on selecting different network', async ({ page }) => {
    await page.getByTestId(NetworkSelectors.AddNetworkBitcoinAPISelector).click();
    await page.getByTestId(NetworkSelectors.BitcoinApiOptionTestnet).click();

    const bitcoinUrl = page.getByTestId(NetworkSelectors.NetworkBitcoinAddress);

    test.expect(await bitcoinUrl.inputValue()).toEqual(BITCOIN_API_BASE_URL_TESTNET3);
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

  test('proper initial values on edit network', async ({ homePage, page, networkPage }) => {
    await networkPage.inputNetworkNameField('Test network');
    await networkPage.inputNetworkKeyField('test-network');
    await networkPage.inputNetworkStacksAddressField('https://leather.granite.world');

    await networkPage.clickAddNetwork();
    await homePage.waitForHomePageReady();

    await homePage.clickSettingsButton();

    await page.getByTestId(SettingsSelectors.ChangeNetworkAction).click();

    await networkPage.page.getByTestId(NetworkSelectors.NetworkMenuBtn).click({ force: true });
    await networkPage.page.getByTestId(NetworkSelectors.EditNetworkMenuBtn).click();

    const stacksInputText = await networkPage.page
      .getByTestId(NetworkSelectors.NetworkStacksAddress)
      .inputValue();

    test.expect(stacksInputText).toEqual('https://leather.granite.world');
  });

  test('delete network', async ({ homePage, page, networkPage }) => {
    const id = 'test-network';

    await networkPage.inputNetworkNameField('Test network');
    await networkPage.inputNetworkKeyField(id);
    await networkPage.inputNetworkStacksAddressField('https://leather.granite.world');

    await networkPage.clickAddNetwork();
    await homePage.waitForHomePageReady();

    await homePage.clickSettingsButton();

    await page.getByTestId(SettingsSelectors.ChangeNetworkAction).click();
    let networkEl = networkPage.page.getByTestId(id);

    await test.expect(networkEl).toHaveCount(1);

    await networkPage.page.getByTestId(NetworkSelectors.NetworkMenuBtn).click({ force: true });
    await networkPage.page.getByTestId(NetworkSelectors.DeleteNetworkMenuBtn).click();

    networkEl = networkPage.page.getByTestId(id);

    await test.expect(networkEl).toHaveCount(0);
  });
});
