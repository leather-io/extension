import type { Page } from '@playwright/test';

import { TEST_ACCOUNT_1_STX_ADDRESS } from './constants';

const mockedStx20Tokens = [
  {
    ticker: 'MEME',
    balance: '100',
    updateDate: '2024-04-08T10:56:16.720Z',
  },
];

export async function mockMainnetTestAccountStx20TokensRequest(page: Page) {
  await page.route(`**/api.stx20.com/api/v1/balance/**`, route =>
    route.fulfill({
      json: { address: TEST_ACCOUNT_1_STX_ADDRESS, balances: mockedStx20Tokens },
    })
  );
}
