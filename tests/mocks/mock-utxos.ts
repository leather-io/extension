import type { Page } from '@playwright/test';

import { BITCOIN_API_BASE_URL_TESTNET3 } from '@leather.io/models';

import { TEST_ACCOUNT_1_NATIVE_SEGWIT_ADDRESS } from './constants';

export const mockUtxos = [
  {
    txid: '58d44000884f0ba4cdcbeb1ac082e6c802d300c16b0d3251738e8cf6a57397ce',
    vout: 0,
    status: {
      confirmed: true,
      block_height: 810183,
      block_hash: '000000000000000000040caf3f438bb15731f6dc0f5ce1eaa6cd2ee8213d72dd',
      block_time: 1696185309,
    },
    value: 546,
  },
];

export const mockUtxosListWithRunes = [
  {
    txid: '66ff7d54e345170e3a76819dc90140971fdae054c9b7eea2089ba5a9720f6e44',
    vout: 1,
    status: {
      confirmed: true,
      block_height: 2585955,
      block_hash: '00000000000000181cae54c3c19d6ed02511a2f6302a666c3d78bcf1777bb029',
      block_time: 1712829917,
    },
    value: 546,
  },
  {
    txid: '3298edc745bdc2168e949382fd42956a7bbe43ab885a49f1212b097ac8243650',
    vout: 1,
    status: {
      confirmed: true,
      block_height: 2586064,
      block_hash: '0000000000000019390bbd88e463230fa4bcc0e8313081c7a4e25fe0b3024712',
      block_time: 1712920121,
    },
    value: 546,
  },
];

export const mockMainnetNsTransactionsTestAccount = [
  {
    txid: '58d44000884f0ba4cdcbeb1ac082e6c802d300c16b0d3251738e8cf6a57397ce',
    version: 2,
    locktime: 0,
    vin: [
      {
        txid: 'a5ab63799f0bbd2571d1b90de9ebff815f7526787e27263d2f604e22f9118d0c',
        vout: 0,
        prevout: {
          scriptpubkey: '5120286626028a2d352bae8dcdfa750025d04ce7f5eb6649a4ddb9ef98eba6315f47',
          scriptpubkey_asm:
            'OP_PUSHNUM_1 OP_PUSHBYTES_32 286626028a2d352bae8dcdfa750025d04ce7f5eb6649a4ddb9ef98eba6315f47',
          scriptpubkey_type: 'v1_p2tr',
          scriptpubkey_address: 'bc1p9pnzvq52956jht5deha82qp96pxw0a0tvey6fhdea7vwhf33tarskqq3nr',
          value: 546,
        },
        scriptsig: '',
        scriptsig_asm: '',
        witness: [
          '839f120447cb677dbd06a2a9b69134be8d38918ee5a2e8ba3e6a3079315401a58b240edcefbbb1b16b5c036194c7c7ceb21d1f647ee352092115f1a8bb56ba53',
        ],
        is_coinbase: false,
        sequence: 0,
      },
      {
        txid: '5c3206e2d7655758e4db05a251571bbc902db7e5c1a1e6f99ca7d6e71bde450b',
        vout: 6,
        prevout: {
          scriptpubkey: '001466124290d2fc62f8cb83c0e15836a548e43dcade',
          scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 66124290d2fc62f8cb83c0e15836a548e43dcade',
          scriptpubkey_type: 'v0_p2wpkh',
          scriptpubkey_address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
          value: 317348,
        },
        scriptsig: '',
        scriptsig_asm: '',
        witness: [
          '3045022100c70352f1beed3b7e38550a679bec8fe9318654080ad7808f06c7118ca775d77302202e6b7859f7305b90d542591fdbd719f59e38a29a5204f726b66cc9227aba329701',
          '039aa0f222ca60f0a4d03ae8047d5972856af82ff186d1b99186fc7b44f0d737c6',
        ],
        is_coinbase: false,
        sequence: 0,
      },
    ],
    vout: [
      {
        scriptpubkey: '0014a45ed156e77d9df111dfb99409beda635695b4b1',
        scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 a45ed156e77d9df111dfb99409beda635695b4b1',
        scriptpubkey_type: 'v0_p2wpkh',
        scriptpubkey_address: 'bc1q530dz4h80kwlzywlhx2qn0k6vdtftd93c499yq',
        value: 546,
      },
      {
        scriptpubkey: '001466124290d2fc62f8cb83c0e15836a548e43dcade',
        scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 66124290d2fc62f8cb83c0e15836a548e43dcade',
        scriptpubkey_type: 'v0_p2wpkh',
        scriptpubkey_address: 'bc1qvcfy9yxjl3303jurcrs4sd49frjrmjk7x045r6',
        value: 314656,
      },
    ],
    size: 330,
    weight: 792,
    fee: 2692,
    status: {
      confirmed: true,
      block_height: 810183,
      block_hash: '000000000000000000040caf3f438bb15731f6dc0f5ce1eaa6cd2ee8213d72dd',
      block_time: 1696185309,
    },
  },
];

export async function mockMainnetTestAccountBitcoinRequests(page: Page) {
  await Promise.all([
    page.route('**/leather.mempool.space/api/address/**/utxo', route =>
      route.fulfill({
        json: [],
      })
    ),
    page.route(
      `**/leather.mempool.space/api/address/${TEST_ACCOUNT_1_NATIVE_SEGWIT_ADDRESS}/txs`,
      route =>
        route.fulfill({
          json: mockMainnetNsTransactionsTestAccount,
        })
    ),
  ]);
}

export async function mockTestnetTestAccountEmptyUtxosRequests(page: Page) {
  await page.route(`${BITCOIN_API_BASE_URL_TESTNET3}/address/**/utxo`, route =>
    route.fulfill({
      json: [],
    })
  );
}
