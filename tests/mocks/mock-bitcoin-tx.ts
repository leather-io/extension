import type { Page } from '@playwright/test';

import { BITCOIN_API_BASE_URL_TESTNET4 } from '@leather.io/models';

import { mockMainnetNsTransactionsTestAccount } from './mock-utxos';

export async function mockTestAccountBtcBroadcastTransaction(page: Page) {
  await page.route(`${BITCOIN_API_BASE_URL_TESTNET4}/tx`, route =>
    route.fulfill({
      body: mockMainnetNsTransactionsTestAccount[0].txid,
    })
  );
}
