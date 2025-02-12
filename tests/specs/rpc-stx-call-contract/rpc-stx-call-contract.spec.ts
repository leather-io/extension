import { BrowserContext, Page } from '@playwright/test';
import {
  type ClarityValue,
  bufferCVFromString,
  noneCV,
  serializeCV,
  standardPrincipalCV,
} from '@stacks/transactions';

import type { RpcParams, stxCallContract } from '@leather.io/rpc';

import { test } from '../../fixtures/fixtures';

test.describe('RPC: stx_callContract', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await page.goto('localhost:3000', { waitUntil: 'networkidle' });
  });

  function checkVisibleContent(context: BrowserContext) {
    return async (buttonToPress: 'Cancel' | 'Confirm') => {
      const popup = await context.waitForEvent('page');
      await popup.waitForSelector('text="name-transfer"');
      await popup.waitForSelector('text="SP00…VF78.bns"');
      await popup.waitForSelector('text="0x6964"');
      await popup.waitForSelector('text="0x74657374"');
      await popup.waitForSelector('text="SP2417H88DQFN7FNDMSKM9N0B3Q6GNGEM40W7ZAZW"');
      await popup.waitForSelector('text="none"');
      await popup.waitForTimeout(500);
      const btn = popup.locator('text="Confirm"');

      if (buttonToPress === 'Confirm') {
        await btn.click();
      } else {
        await popup.close();
      }
    };
  }

  function initiateSip30RpcCallContract(page: Page) {
    return async (params: RpcParams<typeof stxCallContract>) =>
      page.evaluate(
        async params =>
          (window as any).LeatherProvider.request('stx_callContract', {
            ...params,
          }).catch((e: unknown) => e),
        { ...params }
      );
  }

  test.skip('SIP-30 call contract', async ({ page, context }) => {
    const args: ClarityValue[] = [
      bufferCVFromString('id'), // namespace
      bufferCVFromString('test'), // name
      standardPrincipalCV('SP2417H88DQFN7FNDMSKM9N0B3Q6GNGEM40W7ZAZW'), // recipient
      noneCV(), // zonefile
    ];

    const [result] = await Promise.all([
      initiateSip30RpcCallContract(page)({
        contract: 'SP000000000000000000002Q6VF78.bns',
        functionName: 'name-transfer',
        functionArgs: args.map(arg => serializeCV(arg)),
      }),
      checkVisibleContent(context)('Cancel'),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      error: {
        code: 4001,
        message: 'User rejected the Stacks transaction signing request',
      },
    });
  });
});
