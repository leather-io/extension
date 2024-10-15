import { expect } from '@playwright/test';

import { test } from '../../fixtures/fixtures';

const sip10TokenTestId = 'SP265WBWD4NH7TVPYQTVD23X3607NNK4484DTXQZ3.longcoin::longcoin';
const brc20TokenTestId = 'doge';
const src20TokenTestId = 'pxl';
const stx20TokenTestId = 'MEME';
const runeTokenTestId = 'DOGGOTOTHEMOON';

test.describe('manage tokens', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
  });

  test('that supported sip10 token is shown', async ({ homePage }) => {
    await homePage.manageTokensBtn.click();
    const sip10Token = homePage.assetList.getByTestId(sip10TokenTestId);
    await expect(sip10Token).toBeAttached();
  });

  test('that token can be removed from asset list and added back', async ({ homePage }) => {
    await homePage.manageTokensBtn.click();

    // sip10 token
    const sip10InAssetList = homePage.assetList.getByTestId(sip10TokenTestId);
    const sip10TokenInManageTokensList =
      homePage.manageTokensAssetsList.getByTestId(sip10TokenTestId);

    // brc20 token
    const brc20InAssetList = homePage.assetList.getByTestId(brc20TokenTestId);
    const brc20InManageTokensList = homePage.manageTokensAssetsList.getByTestId(brc20TokenTestId);

    // src20 token
    const src20InAssetList = homePage.assetList.getByTestId(src20TokenTestId);
    const src20InManageTokensList = homePage.manageTokensAssetsList.getByTestId(src20TokenTestId);

    // rune token
    const runeInAssetList = homePage.assetList.getByTestId(runeTokenTestId);
    const runeInManageTokensList = homePage.manageTokensAssetsList.getByTestId(runeTokenTestId);

    // stx20 token (disabled by default)
    const stx20InAssetList = homePage.assetList.getByTestId(stx20TokenTestId);
    const stx20InManageTokensList = homePage.manageTokensAssetsList.getByTestId(stx20TokenTestId);

    // disable tokens that are enabled by default
    await sip10TokenInManageTokensList.click();
    await brc20InManageTokensList.click();
    await src20InManageTokensList.click();
    await runeInManageTokensList.click();

    // test that tokens are disabled
    await expect(sip10InAssetList).not.toBeAttached();
    await expect(brc20InAssetList).not.toBeAttached();
    await expect(src20InAssetList).not.toBeAttached();
    await expect(stx20InAssetList).not.toBeAttached();
    await expect(runeInAssetList).not.toBeAttached();

    // enable tokens
    await sip10TokenInManageTokensList.click();
    await brc20InManageTokensList.click();
    await src20InManageTokensList.click();
    await stx20InManageTokensList.click();
    await runeInManageTokensList.click();

    // test that tokens are enabled
    await expect(sip10InAssetList).toBeAttached();
    await expect(brc20InAssetList).toBeAttached();
    await expect(src20InAssetList).toBeAttached();
    await expect(stx20InAssetList).toBeAttached();
    await expect(runeInAssetList).toBeAttached();
  });
});
