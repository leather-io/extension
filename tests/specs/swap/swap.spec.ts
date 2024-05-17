import { test } from '../../fixtures/fixtures';

const hiroApiPostRoute = '*/**/v2/transactions';

// Skip as swaps feature is disabled
test.skip('Swaps', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, swapPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
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
    await swapPage.swapReviewBtn.click({ delay: 2000 });

    const swapProtocol = await swapPage.swapDetailsProtocol.innerText();
    test.expect(swapProtocol).toEqual('ALEX');

    const swapAssets = await swapPage.swapDetailsSymbol.all();
    const swapAssetBase = await swapAssets[0].innerText();
    const swapAssetQuote = await swapAssets[1].innerText();
    test.expect(swapAssetBase).toEqual('STX');
    test.expect(swapAssetQuote).toEqual('ALEX');

    const swapAmounts = await swapPage.swapDetailsAmount.all();
    const swapAmountBase = await swapAmounts[0].innerText();
    test.expect(swapAmountBase).toEqual('1');
  });

  // This test isn't working bc there are multiple requests being made
  // to the same endpoint. We need to know why this happening before
  // enabling it again bc swaps keep occurring which create insufficient
  // balance errors in our integration tests.
  test.skip('that the swap is broadcast', async ({ swapPage }) => {
    const requestPromise = swapPage.page.waitForRequest(hiroApiPostRoute);

    await swapPage.page.route(hiroApiPostRoute, async route => {
      await route.abort();
    });

    await swapPage.inputSwapAmountBase();
    await swapPage.selectAssetToReceive();

    await swapPage.swapReviewBtn.click({ delay: 2000 });
    await swapPage.swapSubmitBtn.click();

    const request = await requestPromise;
    const requestBody = request.postDataBuffer();
    test.expect(requestBody).toBeDefined();
  });
});
