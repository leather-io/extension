import { expect } from '@playwright/test';
import { mockStacksBroadcastTransactionV6 } from '@tests/mocks/mock-stacks-txs';

import { test } from '../../fixtures/fixtures';

test.describe('Swaps', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, swapPage }) => {
    test.setTimeout(60_000);

    await globalPage.setupAndUseApiCalls(extensionId);
    await mockStacksBroadcastTransactionV6(globalPage.page);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.swapButton.click();
    await swapPage.waitForSwapPageReady();
  });

  test('that it defaults to swapping STX', async ({ swapPage }) => {
    test.expect(swapPage.page.getByText('STX')).toBeTruthy();
  });

  test('that it shows swap review details correctly', async ({ swapPage }) => {
    await swapPage.inputSwapAmountBase();
    await swapPage.selectAssetToReceive();
    await swapPage.swapReviewBtn.click();

    const swapProtocol = await swapPage.swapDetailsProtocol.innerText();
    test.expect(swapProtocol).toContain('Bitflow');

    const swapAssets = await swapPage.swapDetailsSymbol.all();
    const swapAssetBase = await swapAssets[0].innerText();
    const swapAssetQuote = await swapAssets[1].innerText();
    test.expect(swapAssetBase).toEqual('STX');
    test.expect(swapAssetQuote).toEqual('ALEX');

    const swapAmounts = await swapPage.swapDetailsAmount.all();
    const swapAmountBase = await swapAmounts[0].innerText();
    test.expect(swapAmountBase).toEqual('1');
  });

  test('that the swap is broadcast', async ({ swapPage }) => {
    await swapPage.inputSwapAmountBase();
    await swapPage.selectAssetToReceive();

    await swapPage.swapReviewBtn.click({ delay: 2000 });
    await swapPage.swapSubmitBtn.click();

    const toastMessage = 'Transaction submitted!';
    const toast = swapPage.page.getByText(toastMessage, { exact: true });
    await expect(toast).toBeVisible();
  });

  test('that it preselects cross-chain swap assets and restricts quote list', async ({
    swapPage,
  }) => {
    await swapPage.selectBtcAsBaseAsset();

    const quoteAsset = await swapPage.page.locator('text="sBTC"').innerText();
    test.expect(quoteAsset).toEqual('sBTC');

    await swapPage.selectQuoteAsset();
    await swapPage.page.locator(swapPage.chooseAssetList).waitFor();
    const quoteAssets = await swapPage.page.locator(swapPage.chooseAssetListItem).all();
    test.expect(quoteAssets.length).toEqual(1);
  });
});
