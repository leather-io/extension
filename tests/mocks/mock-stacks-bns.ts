import type { Page } from '@playwright/test';

import { TEST_ACCOUNT_1_STX_ADDRESS } from './constants';

export async function mockMainnetTestAccountStacksBnsNameRequest(page: Page) {
  await page.route(`**/api.hiro.so/v1/addresses/stacks/${TEST_ACCOUNT_1_STX_ADDRESS}`, route =>
    route.fulfill({
      json: {
        names: [],
      },
    })
  );
}
