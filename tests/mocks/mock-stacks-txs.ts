import type { Page } from '@playwright/test';

import { TEST_ACCOUNT_1_STX_ADDRESS } from './constants';

export async function mockMainnetTestAccountStacksTxsRequests(page: Page) {
  await Promise.all([
    page.route(
      `**/api.hiro.so/extended/v1/address/${TEST_ACCOUNT_1_STX_ADDRESS}/transactions_with_transfers?limit=50`,
      route =>
        route.fulfill({
          json: {
            limit: 50,
            offset: 0,
            total: 0,
            results: [],
          },
        })
    ),

    page.route(
      `**/api.hiro.so/extended/v1/tx/mempool?address=${TEST_ACCOUNT_1_STX_ADDRESS}&limit=50`,
      route =>
        route.fulfill({
          json: {
            limit: 50,
            offset: 0,
            total: 0,
            results: [],
          },
        })
    ),
  ]);
}
