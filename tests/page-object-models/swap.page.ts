import { Locator, Page } from '@playwright/test';
import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { createTestSelector } from '@tests/utils';

export class SwapPage {
  readonly page: Page;
  readonly chooseAssetList: Locator;
  readonly chooseAssetListItem: Locator;
  readonly selectAssetBtn: Locator;
  readonly swapAmountInput: Locator;
  readonly swapBtn: Locator;
  readonly swapDetailsAmount: Locator;
  readonly swapDetailsProtocol: Locator;
  readonly swapDetailsSymbol: Locator;
  readonly swapReviewBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.chooseAssetList = page.getByTestId(SwapSelectors.ChooseAssetList);
    this.chooseAssetListItem = page.getByTestId(SwapSelectors.ChooseAssetListItem);
    this.selectAssetBtn = page.getByTestId(SwapSelectors.SelectAssetTriggerBtn);
    this.swapAmountInput = page.getByTestId(SwapSelectors.SwapAmountInput);
    this.swapBtn = page.getByTestId(SwapSelectors.SwapBtn);
    this.swapDetailsAmount = page.getByTestId(SwapSelectors.SwapDetailsAmount);
    this.swapDetailsProtocol = page.getByTestId(SwapSelectors.SwapDetailsProtocol);
    this.swapDetailsSymbol = page.getByTestId(SwapSelectors.SwapDetailsSymbol);
    this.swapReviewBtn = page.getByTestId(SwapSelectors.SwapReviewBtn);
  }

  async waitForSwapPageReady() {
    await this.page.waitForSelector(createTestSelector(SwapSelectors.SwapPageReady), {
      state: 'attached',
    });
  }

  async selectAssetToReceive() {
    const swapAssetSelectors = await this.selectAssetBtn.all();
    await swapAssetSelectors[1].click();
    await this.chooseAssetList.waitFor();
    const swapAssets = await this.chooseAssetListItem.all();
    await swapAssets[0].click();
    await this.swapReviewBtn.click();
  }
}
