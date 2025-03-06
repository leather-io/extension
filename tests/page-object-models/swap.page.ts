import { Locator, Page } from '@playwright/test';
import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { createTestSelector } from '@tests/utils';

export class SwapPage {
  readonly page: Page;
  readonly swapReviewBtn: Locator;
  readonly swapSubmitBtn: Locator;
  readonly swapDetailsAmount: Locator;
  readonly swapDetailsProtocol: Locator;
  readonly swapDetailsSymbol: Locator;
  readonly chooseAssetList = createTestSelector(SwapSelectors.SwapAssetList);
  readonly chooseAssetListItem = createTestSelector(SwapSelectors.SwapAssetListItem);
  readonly selectAssetBtn = createTestSelector(SwapSelectors.SelectAssetTriggerBtn);
  readonly swapAmountInput = createTestSelector(SwapSelectors.SwapAmountInput);

  constructor(page: Page) {
    this.page = page;
    this.swapReviewBtn = page.getByTestId(SwapSelectors.SwapReviewBtn);
    this.swapSubmitBtn = page.getByTestId(SwapSelectors.SwapSubmitBtn);
    this.swapDetailsAmount = page.getByTestId(SwapSelectors.SwapDetailsAmount);
    this.swapDetailsProtocol = page.getByTestId(SwapSelectors.SwapDetailsProtocol);
    this.swapDetailsSymbol = page.getByTestId(SwapSelectors.SwapDetailsSymbol);
  }

  async waitForSwapPageReady() {
    await this.page.waitForSelector(createTestSelector(SwapSelectors.SwapPageReady), {
      state: 'attached',
    });
  }

  async selectAssetToReceive() {
    const swapAssetSelectors = await this.page.locator(this.selectAssetBtn).all();
    await swapAssetSelectors[1].click();
    await this.page.locator(this.chooseAssetList).waitFor();
    await this.page.locator('text="ALEX"').click();
  }

  async inputSwapAmountBase() {
    const swapAmountInputs = await this.page.locator(this.swapAmountInput).all();
    await swapAmountInputs[0].fill('1');
  }

  async selectBtcAsBaseAsset() {
    const swapAssetSelectors = await this.page.locator(this.selectAssetBtn).all();
    await swapAssetSelectors[0].click();
    await this.page.locator(this.chooseAssetList).waitFor();
    await this.page.locator('text="BTC"').click();
  }

  async selectQuoteAsset() {
    const swapAssetSelectors = await this.page.locator(this.selectAssetBtn).all();
    await swapAssetSelectors[1].click();
  }
}
