import type { Page } from '@playwright/test';

const mockedStacksBalances = {
  stx: {
    balance: '13568037',
    total_sent: '15097000',
    total_received: '39683037',
    total_fees_sent: '11018000',
    total_miner_rewards_received: '0',
    lock_tx_id: '',
    locked: '0',
    lock_height: 0,
    burnchain_lock_height: 0,
    burnchain_unlock_height: 0,
  },
  fungible_tokens: {
    'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-special-vote::special-vote': {
      balance: '2579839300',
      total_sent: '0',
      total_received: '2579839300',
    },
    'SP265WBWD4NH7TVPYQTVD23X3607NNK4484DTXQZ3.longcoin::longcoin': {
      balance: '1888888000000',
      total_sent: '0',
      total_received: '1888888000000',
    },
    'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.nope::NOT': {
      balance: '10000',
      total_sent: '0',
      total_received: '10000',
    },
    'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token::alex': {
      balance: '2579839299',
      total_sent: '8000000000',
      total_received: '10579839299',
    },
    'SPWECF3XYVRBRCN23CJJCX9XKSF8RFWQPAQMWXT.blockstack::BLOCKSTACK': {
      balance: '60000000000',
      total_sent: '0',
      total_received: '60000000000',
    },
  },
  non_fungible_tokens: {},
};

export async function mockMainnetTestAccountStacksBalancesRequest(page: Page) {
  await page.route('**/api.hiro.so/extended/v1/address/**/balances', route =>
    route.fulfill({
      json: mockedStacksBalances,
    })
  );
}
