import { Page } from '@playwright/test';
import { json } from '@tests/utils';

import { mockMainnetTestAccountStacksBnsNameRequest } from './mock-stacks-bns';
import { mockStacksFeeRequests } from './mock-stacks-fees';
import { mockMainnetTestAccountStacksFTsRequest } from './mock-stacks-fts';
import { mockMainnetTestAccountStacksNFTsRequest } from './mock-stacks-nfts';
import { mockMainnetTestAccountStacksTxsRequests } from './mock-stacks-txs';
import { mockMainnetTestAccountBitcoinRequests } from './mock-utxos';

export async function setupMockApis(page: Page) {
  await Promise.all([
    page.route(/chrome-extension/, route => route.continue()),
    page.route(/github/, route => route.fulfill(json({}))),
    page.route('https://api.hiro.so/', route => route.fulfill()),
    page.route('https://api.testnet.hiro.so/', route => route.fulfill()),
    mockMainnetTestAccountBitcoinRequests(page),
    mockStacksFeeRequests(page),
    mockMainnetTestAccountStacksBnsNameRequest(page),
    mockMainnetTestAccountStacksTxsRequests(page),
    mockMainnetTestAccountStacksNFTsRequest(page),
    mockMainnetTestAccountStacksFTsRequest(page),
  ]);
}
