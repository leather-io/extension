import { BrowserContext, Page } from '@playwright/test';
import { ClarityVersion } from '@stacks/transactions';
import { mockStacksTokenContract } from '@tests/mocks/mock-stacks-contract';

import type { RpcParams, stxDeployContract } from '@leather.io/rpc';

import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';

import { test } from '../../fixtures/fixtures';

test.describe('RPC: stx_deployContract', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await page.goto('localhost:3000', { waitUntil: 'networkidle' });
  });

  function checkVisibleContent(context: BrowserContext) {
    return async (buttonToPress: 'Cancel' | 'Confirm') => {
      const popup = await context.waitForEvent('page');
      await popup.waitForSelector('text="mock-contract-name"');
      await popup.waitForSelector('text="SPS8CKF63P16J28AYF7PXW9E5AACH0NZNTEFWSFE"');
      await popup.waitForTimeout(500);
      const btn = popup.locator('text="Confirm"');

      if (buttonToPress === 'Confirm') {
        await btn.click();
      } else {
        await popup.close();
      }
    };
  }

  function initiateSip30RpcDeployContract(page: Page) {
    return async (params: RpcParams<typeof stxDeployContract>) =>
      page.evaluate(
        async params =>
          (window as any).LeatherProvider.request('stx_deployContract', {
            ...params,
          }).catch((e: unknown) => e),
        { ...params }
      );
  }

  test('SIP-30 deploy contract', async ({ page, context }) => {
    const [result] = await Promise.all([
      initiateSip30RpcDeployContract(page)({
        name: `mock-contract-name`,
        clarityCode: mockStacksTokenContract,
        clarityVersion: ClarityVersion.Clarity3,
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
