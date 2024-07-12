import { Page } from '@playwright/test';
import { json } from '@tests/utils';

import { mockStacksFeeRequests } from './mock-stacks-fees';
import { mockMainnetTestAccountBlockstreamRequests } from './mock-utxos';

export async function setupMockApis(page: Page) {
  await Promise.all([
    page.route(/chrome-extension/, route => route.continue()),
    page.route(/github/, route => route.fulfill(json({}))),
    page.route('https://api.hiro.so/', route => route.fulfill()),
    page.route('https://api.testnet.hiro.so/', route => route.fulfill()),
    mockMainnetTestAccountBlockstreamRequests(page),
    mockStacksFeeRequests(page),
  ]);
}
