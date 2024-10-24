import type { Page } from '@playwright/test';

import { TEST_ACCOUNT_1_STX_ADDRESS } from './constants';

const mockedStacksPendingTransaction = {
  tx_id: '0x2fd347fd2f775db6bec23e566a1d1d4914f10502f6a0d44692e93aa80cf047e4',
  nonce: 14,
  fee_rate: '3000',
  sender_address: TEST_ACCOUNT_1_STX_ADDRESS,
  sponsored: false,
  post_condition_mode: 'deny',
  post_conditions: [],
  anchor_mode: 'any',
  tx_status: 'pending',
  receipt_time: 1729168336,
  receipt_time_iso: '2024-10-17T12:32:16.000Z',
  tx_type: 'token_transfer',
  token_transfer: {
    recipient_address: 'ST3WSKSKGNFCDGJN9EXF6AC9NFF69XNNFXN2DQA7E',
    amount: '1000000',
    memo: '0x00000000000000000000000000000000000000000000000000000000000000000000',
  },
};

const mockedStacksTxsRequestWithPendingTx = {
  limit: 50,
  offset: 0,
  total: 1,
  results: [mockedStacksPendingTransaction],
};

const mempoolUrl = `**/api.hiro.so/extended/v1/tx/mempool?address=${TEST_ACCOUNT_1_STX_ADDRESS}&limit=50`;

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

    page.route(mempoolUrl, route =>
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

export async function mockTestAccountStacksTxsRequestsWithPendingTx(page: Page) {
  await page.route(mempoolUrl, route =>
    route.fulfill({
      json: mockedStacksTxsRequestWithPendingTx,
    })
  );
}

const mockedPendingRawTx = {
  raw_tx:
    '0x80800000000400fff493c4bfd46883c20368a72abd4f381ded75e1000000000000000e0000000000000bb800016179b365db452be698ef57cd8702b2ddecf3914342d70f960a80fd1221b72df1338b3f1b089843c99f2cb36e8562712901590a06c2f2aa22c5ca3be9e1de80cf03020000000000051af999e670abd8d84aa9775e6531357bcc9ed6afed00000000000f424000000000000000000000000000000000000000000000000000000000000000000000',
};

export async function mockStacksRawTx(page: Page) {
  await page.route(
    `**/api.hiro.so/extended/v1/tx/0x2fd347fd2f775db6bec23e566a1d1d4914f10502f6a0d44692e93aa80cf047e4/raw`,
    route =>
      route.fulfill({
        json: mockedPendingRawTx,
      })
  );
}

export async function mockStacksPendingTransaction(page: Page) {
  await page.route(
    `**/api.hiro.so/extended/v1/tx/0x2fd347fd2f775db6bec23e566a1d1d4914f10502f6a0d44692e93aa80cf047e4`,
    route =>
      route.fulfill({
        json: mockedStacksPendingTransaction,
      })
  );
}

export async function mockStacksBroadcastCancelTransaction(page: Page) {
  await page.route(`**/api.hiro.so/v2/transactions`, route =>
    route.fulfill({
      body: '9b709768122e6c62a37b087106cc9c23280ed6242b565484b6cc4e6a43ae1155',
    })
  );
}
