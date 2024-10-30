import type { Page } from '@playwright/test';

import { BESTINSLOT_API_BASE_URL_TESTNET } from '@leather.io/models';
import { type BestInSlotInscriptionResponse } from '@leather.io/query';

export async function mockTestnetTestAccountInscriptionsRequests(
  page: Page,
  inscriptions: BestInSlotInscriptionResponse[]
) {
  await page.route(
    new RegExp(`${BESTINSLOT_API_BASE_URL_TESTNET}/wallet/inscriptions_xpub.*`),
    async route => {
      const request = route.request();

      if (request.url().includes('xpub=tr')) {
        await route.fulfill({
          json: { block_height: 859832, data: inscriptions },
        });
        return;
      }
      await route.fulfill({ json: { block_height: 859832, data: [] } });
    }
  );
}
