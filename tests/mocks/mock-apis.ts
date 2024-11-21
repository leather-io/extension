import { Page } from '@playwright/test';
import { json } from '@tests/utils';

import {
  mockMainnetAlexAssetsRequest,
  mockMainnetAlexTokenPricesRequest,
} from './mock-alex-assets';
import { mockMainnetTestAccountBrc20TokensRequest } from './mock-brc20';
import { mockMainnetTestAccountRunesOutputsRequest } from './mock-runes';
import { mockMainnetTestAccountStampchainRequest } from './mock-src20';
import { mockMainnetTestAccountStacksBalancesRequest } from './mock-stacks-balances';
import { mockMainnetTestAccountStacksBnsNameRequest } from './mock-stacks-bns';
import { mockStacksFeeRequests } from './mock-stacks-fees';
import { mockMainnetTestAccountStacksFTsRequest } from './mock-stacks-fts';
import { mockMainnetTestAccountStacksNFTsRequest } from './mock-stacks-nfts';
import { mockMainnetTestAccountStacksTxsRequests } from './mock-stacks-txs';
import { mockMainnetTestAccountStx20TokensRequest } from './mock-stx20';
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
    mockMainnetTestAccountStacksBalancesRequest(page),
    mockMainnetAlexAssetsRequest(page),
    mockMainnetAlexTokenPricesRequest(page),

    mockMainnetTestAccountStampchainRequest(page),
    mockMainnetTestAccountBrc20TokensRequest(page),
    mockMainnetTestAccountStx20TokensRequest(page),
    mockMainnetTestAccountRunesOutputsRequest(page),
  ]);
}
