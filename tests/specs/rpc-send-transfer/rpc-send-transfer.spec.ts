import { BrowserContext, Page } from '@playwright/test';
import { TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS } from '@tests/mocks/constants';
import { mockTestAccountBtcBroadcastTransaction } from '@tests/mocks/mock-bitcoin-tx';

import type { RpcParams, sendTransfer } from '@leather.io/rpc';

import { test } from '../../fixtures/fixtures';

const baseParams = {
  recipients: [
    {
      address: TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS,
      amount: '800',
    },
    {
      address: TEST_TESTNET_ACCOUNT_2_BTC_ADDRESS,
      amount: '900',
    },
  ],
  network: 'testnet',
};

test.describe('RPC: sendTransfer', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await page.goto('localhost:3000', { waitUntil: 'networkidle' });
  });

  function clickActionButton(context: BrowserContext) {
    return async (buttonToPress: 'Cancel' | 'Approve') => {
      const popup = await context.waitForEvent('page');
      await popup.waitForTimeout(1000);
      const btn = popup.locator(`text="${buttonToPress}"`);
      await btn.click();
    };
  }

  async function mockPopupRequests(context: BrowserContext) {
    const popup = await context.waitForEvent('page');
    await mockTestAccountBtcBroadcastTransaction(popup);
  }

  function openSendTransfer(page: Page) {
    return async (params: RpcParams<typeof sendTransfer>) =>
      page.evaluate(
        async params =>
          (window as any).LeatherProvider?.request('sendTransfer', {
            ...params,
          }).catch((e: unknown) => e),
        { ...params }
      );
  }

  test('that the request can be broadcast', async ({ page, context }) => {
    void mockPopupRequests(context);

    const [result] = await Promise.all([
      openSendTransfer(page)(baseParams),
      clickActionButton(context)('Approve'),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      result: { txid: '58d44000884f0ba4cdcbeb1ac082e6c802d300c16b0d3251738e8cf6a57397ce' },
    });
  });

  test('that the request can be cancelled', async ({ page, context }) => {
    const [result] = await Promise.all([
      openSendTransfer(page)(baseParams),
      clickActionButton(context)('Cancel'),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      error: {
        code: 4001,
        message: 'User rejected signing the transaction',
      },
    });
  });
});
