import type { Page } from '@playwright/test';

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

const mockedBnsV2NamesResponse = {
  total: 1,
  current_burn_block: 869830,
  limit: 50,
  offset: 0,
  names: [{ full_name: 'leather.btc', name_string: 'leather', namespace_string: 'btc' }],
};

export async function mockBnsV2NamesRequest(page: Page) {
  await page.route(`**/api.bnsv2.com/names/address/${TEST_ACCOUNT_1_STX_ADDRESS}/valid`, route =>
    route.fulfill({ json: mockedBnsV2NamesResponse })
  );
}
