import type { Page } from '@playwright/test';

const mockedFtBalancesV2 = {
  limit: 100,
  offset: 0,
  total: 5,
  results: [
    {
      token: 'SP265WBWD4NH7TVPYQTVD23X3607NNK4484DTXQZ3.longcoin::longcoin',
      balance: '1888888000000',
    },
    {
      token: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-special-vote::special-vote',
      balance: '2579839300',
    },
    {
      token: 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.nope::NOT',
      balance: '10000',
    },
    {
      token: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token::alex',
      balance: '2579839299',
    },
    {
      token: 'SPWECF3XYVRBRCN23CJJCX9XKSF8RFWQPAQMWXT.blockstack::BLOCKSTACK',
      balance: '60000000000',
    },
  ],
};

const mockedStxBalanceV2 = {
  balance: '13568037',
  total_miner_rewards_received: '0',
  lock_tx_id: '',
  locked: '0',
  lock_height: 0,
  burnchain_lock_height: 0,
  burnchain_unlock_height: 0,
};

export async function mockMainnetTestAccountStacksBalancesV2Request(page: Page) {
  await page.route('**hiro.so/extended/v2/addresses/**/balances/ft', route =>
    route.fulfill({
      json: mockedFtBalancesV2,
    })
  );

  await page.route('**hiro.so/extended/v2/addresses/**/balances/stx', route =>
    route.fulfill({
      json: mockedStxBalanceV2,
    })
  );
}
