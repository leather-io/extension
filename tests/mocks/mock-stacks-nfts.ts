import type { Page } from '@playwright/test';

import { TEST_ACCOUNT_1_STX_ADDRESS } from './constants';

export async function mockMainnetTestAccountStacksNFTsRequest(page: Page) {
  await page.route(
    `**/api.hiro.so/extended/v1/tokens/nft/holdings?principal=${TEST_ACCOUNT_1_STX_ADDRESS}&limit=50`,
    route =>
      route.fulfill({
        json: {
          limit: 50,
          offset: 0,
          total: 0,
          results: [],
        },
      })
  );
}
