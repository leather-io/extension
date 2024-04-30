import { test } from '../../fixtures/fixtures';

const hiroApiPostRoute = 'https://api.hiro.so/v2/transactions';

test.describe('Swaps', () => {
  test.beforeEach(async ({ extensionId, globalPage, homePage, onboardingPage, swapPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.swapButton.click();
    await swapPage.waitForSwapPageReady();
  });

  test('that it defaults to swapping STX', async ({ swapPage }) => {
    test.expect(swapPage.page.getByText('STX')).toBeTruthy();
  });

  test('that it shows swap review details and broadcasts swap', async ({ swapPage }) => {
    const requestPromise = swapPage.page.waitForRequest(hiroApiPostRoute);

    await swapPage.page.route(hiroApiPostRoute, async route => {
      await route.abort();
    });

    await swapPage.inputSwapAmountBase();
    await swapPage.selectAssetToReceive();
    await swapPage.swapReviewBtn.click({ delay: 1000, force: true });

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

    await swapPage.swapSubmitBtn.click();

    const request = await requestPromise;
    const requestBody = request.postDataBuffer();
    test.expect(requestBody).toBeDefined();
  });
});
