import { Page } from '@playwright/test';
import { json } from '@tests/utils';

export const setupMockApis = async (page: Page) => {
  await page.route(/chrome-extension/, route => route.continue());
  await page.route(/github/, route => route.fulfill(json({})));
};
