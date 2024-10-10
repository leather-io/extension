import type { Page } from '@playwright/test';

import { TEST_ACCOUNT_1_NATIVE_SEGWIT_ADDRESS } from './constants';

export const mockRunesOutputsByAddressList = [
  {
    pkscript: '00148027825ee06ad337f9716df8137a1b651163c5b0',
    wallet_addr: 'tb1qsqncyhhqdtfn07t3dhupx7smv5gk83ds6k0gfa',
    output: '3298edc745bdc2168e949382fd42956a7bbe43ab885a49f1212b097ac8243650:1',
    rune_ids: ['2585883:3795'],
    balances: [100000000],
    rune_names: ['BESTINSLOTXYZ'],
    spaced_rune_names: ['BESTINSLOT•XYZ'],
  },
];

const mockedRunesOutputsByAddress = [
  {
    pkscript: '5120708b3d28256de410602dda703cb9b3146763cb0ccb555531aafc8a94316c74dd',
    wallet_addr: 'bc1pwz9n62p9dhjpqcpdmfcrewdnz3nk8jcved242vd2lj9fgvtvwnwscvdyre',
    rune_id: '840000:3',
    total_balance: '88980500000',
    rune_name: 'DOGGOTOTHEMOON',
    spaced_rune_name: 'DOG•GO•TO•THE•MOON',
    decimals: 5,
    avg_unit_price_in_sats: 6.057369808699874,
    min_listed_unit_price_in_sats: 4.830420338815427,
    min_listed_unit_price_unisat: 6.13049629380624,
  },
  {
    pkscript: '5120708b3d28256de410602dda703cb9b3146763cb0ccb555531aafc8a94316c74dd',
    wallet_addr: 'bc1pwz9n62p9dhjpqcpdmfcrewdnz3nk8jcved242vd2lj9fgvtvwnwscvdyre',
    rune_id: '844943:1452',
    total_balance: '1',
    rune_name: 'BEAUTIFULLEATHER',
    spaced_rune_name: 'BEAUTIFUL•LEATHER',
    decimals: 0,
    avg_unit_price_in_sats: null,
    min_listed_unit_price_in_sats: null,
    min_listed_unit_price_unisat: null,
  },
  {
    pkscript: '5120708b3d28256de410602dda703cb9b3146763cb0ccb555531aafc8a94316c74dd',
    wallet_addr: 'bc1pwz9n62p9dhjpqcpdmfcrewdnz3nk8jcved242vd2lj9fgvtvwnwscvdyre',
    rune_id: '840010:93',
    total_balance: '100000',
    rune_name: 'THEGODOFBITCOIN',
    spaced_rune_name: 'THE•GOD•OF•BITCOIN',
    decimals: 0,
    avg_unit_price_in_sats: 0.0076404,
    min_listed_unit_price_in_sats: 0.011055,
    min_listed_unit_price_unisat: 0.011055,
  },
  {
    pkscript: '5120708b3d28256de410602dda703cb9b3146763cb0ccb555531aafc8a94316c74dd',
    wallet_addr: 'bc1pwz9n62p9dhjpqcpdmfcrewdnz3nk8jcved242vd2lj9fgvtvwnwscvdyre',
    rune_id: '840000:35',
    total_balance: '10392700000000',
    rune_name: 'LOBOTHEWOLFPUP',
    spaced_rune_name: 'LOBO•THE•WOLF•PUP',
    decimals: 8,
    avg_unit_price_in_sats: 1.2652523211622648,
    min_listed_unit_price_in_sats: 1.4270991593917397,
    min_listed_unit_price_unisat: 1.4270991863775586,
  },
  {
    pkscript: '5120708b3d28256de410602dda703cb9b3146763cb0ccb555531aafc8a94316c74dd',
    wallet_addr: 'bc1pwz9n62p9dhjpqcpdmfcrewdnz3nk8jcved242vd2lj9fgvtvwnwscvdyre',
    rune_id: '840022:28',
    total_balance: '100000000',
    rune_name: 'ZBITBLUEBITCOIN',
    spaced_rune_name: 'ZBIT•BLUE•BITCOIN',
    decimals: 8,
    avg_unit_price_in_sats: 808.45,
    min_listed_unit_price_in_sats: 803.9999999999999,
    min_listed_unit_price_unisat: 803.9999999999999,
  },
  {
    pkscript: '5120708b3d28256de410602dda703cb9b3146763cb0ccb555531aafc8a94316c74dd',
    wallet_addr: 'bc1pwz9n62p9dhjpqcpdmfcrewdnz3nk8jcved242vd2lj9fgvtvwnwscvdyre',
    rune_id: '863031:10',
    total_balance: '15000',
    rune_name: 'RUNESASFUCK',
    spaced_rune_name: 'RUNES•AS•FUCK',
    decimals: 0,
    avg_unit_price_in_sats: null,
    min_listed_unit_price_in_sats: 2.0100001694943983,
    min_listed_unit_price_unisat: 2.01,
  },
];

export async function mockMainnetTestAccountRunesOutputsRequest(page: Page) {
  await page.route(
    `**/leatherapi.bestinslot.xyz/v3/runes/wallet_balances?address=${TEST_ACCOUNT_1_NATIVE_SEGWIT_ADDRESS}`,
    route =>
      route.fulfill({
        json: { block_height: 864803, data: mockedRunesOutputsByAddress },
      })
  );
}
