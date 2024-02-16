import { BrowserContext, Page } from '@playwright/test';
import { TEST_ACCOUNT_1_XPUB } from '@tests/mocks/constants';

import { test } from '../../fixtures/fixtures';

test.describe('RPC get Xpub', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await page.goto('localhost:3000', { waitUntil: 'networkidle' });
  });

  function checkVisibleContent(context: BrowserContext) {
    return async (buttonToPress: 'Cancel' | 'Confirm') => {
      const popup = await context.waitForEvent('page');
      await popup.waitForTimeout(500);
      const btn = popup.locator('text="Connect Leather"');

      if (buttonToPress === 'Confirm') {
        await btn.click();
      } else {
        await popup.close();
      }
    };
  }

  function initiateRPCGetXpub(page: Page) {
    return async () =>
      page.evaluate(async () =>
        (window as any).LeatherProvider.request('getXpub').catch((e: unknown) => e)
      );
  }

  test('that xpub is correct', async ({ page, context }) => {
    const xpub = TEST_ACCOUNT_1_XPUB;
    const [result] = await Promise.all([
      initiateRPCGetXpub(page)(),
      checkVisibleContent(context)('Confirm'),
    ]);

    test.expect(result.result.xpubs[0].xpub).toEqual(xpub);
  });
});
