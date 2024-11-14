import type { Page } from '@playwright/test';

import { bnsV2NamesByAddressResponseSchema, bnsV2ZoneFileResponseSchema } from '@leather.io/query';

import { TEST_ACCOUNT_1_STX_ADDRESS } from './constants';

export async function mockMainnetTestAccountStacksBnsNameRequest(page: Page) {
  await page.route(`**/api.hiro.so/v1/addresses/stacks/${TEST_ACCOUNT_1_STX_ADDRESS}`, route =>
    route.fulfill({
      json: {
        names: [],
      },
    })
  );
}

const mockedBnsV2NamesResponse = bnsV2NamesByAddressResponseSchema.parse({
  total: 1,
  current_burn_block: 869830,
  limit: 50,
  offset: 0,
  names: [
    {
      full_name: 'leather.btc',
      name_string: 'leather',
      namespace_string: 'btc',
      owner: 'leather',
      registered_at: '2021-09-29T20:00:00Z',
      renewal_height: 'sdlkfsldjks',
      stx_burn: '0',
      revoked: false,
    },
  ],
});

export async function mockBnsV2NamesRequest(page: Page) {
  await page.route(`**/api.bnsv2.com/names/address/${TEST_ACCOUNT_1_STX_ADDRESS}/valid`, route =>
    route.fulfill({ json: mockedBnsV2NamesResponse })
  );
}

function createSuccessfulBnsV2ZoneFileLookupMockResponse(owner: string, btcAddress: string) {
  return bnsV2ZoneFileResponseSchema.parse({
    zonefile: {
      owner,
      btc: btcAddress,
      general: '',
      twitter: '',
      url: '',
      nostr: '',
      lightning: '',
      subdomains: [],
    },
  });
}

export function mockBnsV2ZoneFileLookup(page: Page) {
  return ({ name, owner, btcAddress }: { name: string; owner: string; btcAddress: string }) =>
    page.route(`**/api.bnsv2.com/resolve-name/${name}`, route =>
      route.fulfill({ json: createSuccessfulBnsV2ZoneFileLookupMockResponse(owner, btcAddress) })
    );
}
