import type { Page } from '@playwright/test';

import { BESTINSLOT_API_BASE_URL_TESTNET } from '@leather.io/models';
import { type BestInSlotInscriptionResponse } from '@leather.io/query';

import { TEST_TESTNET_ACCOUNT_2_TAPROOT_ADDRESS } from './constants';

export async function mockTestnetTestAccountInscriptionsRequests(
  page: Page,
  inscriptions: BestInSlotInscriptionResponse[]
) {
  await page.route(`${BESTINSLOT_API_BASE_URL_TESTNET}/wallet/inscriptions_batch`, async route => {
    const request = route.request();
    const data = request.postData();
    const requestBody = data ? JSON.parse(data) : {};

    if (requestBody.addresses?.includes(TEST_TESTNET_ACCOUNT_2_TAPROOT_ADDRESS)) {
      await route.fulfill({
        json: { block_height: 859832, data: inscriptions },
      });
      return;
    }
    await route.fulfill({
      json: { block_height: 859832, data: [] },
    });
  });
}
