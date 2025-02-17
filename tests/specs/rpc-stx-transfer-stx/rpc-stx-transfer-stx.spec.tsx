import type { BrowserContext, Page } from '@playwright/test';
import { TEST_ACCOUNT_2_STX_ADDRESS } from '@tests/mocks/constants';

import type { RpcParams, stxTransferStx } from '@leather.io/rpc';

import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';

import { test } from '../../fixtures/fixtures';

test.describe('RPC: stx_transferStx', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await page.goto('localhost:3000', { waitUntil: 'networkidle' });
  });

  function checkVisibleContent(context: BrowserContext) {
    return async (buttonToPress: 'Cancel' | 'Confirm') => {
      const popup = await context.waitForEvent('page');
      await popup.waitForSelector('text="0.0001"');
      await popup.waitForSelector('text="SPXH3HNBPM5YP15VH16ZXZ9AX6CK289K3MCXRKCB"');
      await popup.waitForSelector('text="100"');
      await popup.waitForSelector('text="mock-memo"');
      await popup.waitForTimeout(500);
      const btn = popup.locator('text="Confirm"');

      if (buttonToPress === 'Confirm') {
        await btn.click();
      } else {
        await popup.close();
      }
    };
  }

  function initiateSip30RpcTransferStx(page: Page) {
    return async (params: RpcParams<typeof stxTransferStx>) =>
      page.evaluate(
        async params =>
          (window as any).LeatherProvider.request('stx_transferStx', {
            ...params,
          }).catch((e: unknown) => e),
        { ...params }
      );
  }

  test('SIP-30 transfer stx', async ({ page, context }) => {
    const [result] = await Promise.all([
      initiateSip30RpcTransferStx(page)({
        amount: 100,
        memo: 'mock-memo',
        recipient: TEST_ACCOUNT_2_STX_ADDRESS,
      }),
      checkVisibleContent(context)('Cancel'),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      error: {
        code: 4001,
        message: RpcErrorMessage.UserRejectedSigning,
      },
    });
  });
});
