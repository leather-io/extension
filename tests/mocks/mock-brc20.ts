import type { Page } from '@playwright/test';

import { TEST_ACCOUNT_1_NATIVE_SEGWIT_ADDRESS } from './constants';

const mockedBrc20Tokens = [
  {
    ticker: 'doge',
    overall_balance: '4198.0000000000000000',
    available_balance: '4186.0000000000000000',
    transferrable_balance: '12.0000000000000000',
    image_url: 'https://bis-brc20.fra1.cdn.digitaloceanspaces.com/big_icons/DOGE.png',
    min_listed_unit_price: 0.14,
  },
];

const mockedBrc20TickerInfo = {
  ticker: 'doge',
  original_ticker: 'doge',
  image_url: 'https://bis-brc20.fra1.cdn.digitaloceanspaces.com/big_icons/DOGE.png',
  decimals: 18,
  limit_per_mint: 4200,
  max_supply: 1000000000000,
  minted_supply: 1445467443.1,
  burned_supply: 0,
  mint_progress: 0.14454674430999997,
  holder_count: 22597,
  tx_count: 4482,
  deploy_ts: '2023-03-09T07:10:34.000Z',
  deploy_incr_number: 359088,
  deploy_inscr_id: 'c7ee58a761f23d68b4a35c16f25e96fe9317a63d8a951eff9773099ba08cb6adi0',
  is_self_mint: false,
};

export async function mockMainnetTestAccountBrc20TokensRequest(page: Page) {
  await page.route(
    `**/leatherapi.bestinslot.xyz/v3/brc20/wallet_balances?address=${TEST_ACCOUNT_1_NATIVE_SEGWIT_ADDRESS}`,
    route =>
      route.fulfill({
        json: {
          block_height: 864772,
          data: mockedBrc20Tokens,
        },
      })
  );

  await page.route(`**/leatherapi.bestinslot.xyz/v3/brc20/ticker_info?ticker=doge`, route =>
    route.fulfill({
      json: {
        block_height: 864772,
        data: mockedBrc20TickerInfo,
      },
    })
  );
}
