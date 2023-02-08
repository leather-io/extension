import { json } from '@tests/utils';
import { Page } from 'playwright';

export const setupMockApis = async (page: Page) => {
  await page.route(/chrome-extension/, route => route.continue());
  await page.route(/github/, route => route.fulfill(json({})));
};
