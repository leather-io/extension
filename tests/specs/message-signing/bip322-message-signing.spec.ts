import { BrowserContext, Page } from '@playwright/test';

import { test } from '../../fixtures/fixtures';

test.describe('Message signing', () =>
  test.describe('BIP-322 message signing', () => {
    test.beforeEach(async ({ extensionId, globalPage, onboardingPage, page }) => {
      await globalPage.setupAndUseApiCalls(extensionId);
      await onboardingPage.signInWithTestAccount(extensionId);
      await page.goto('https://wallet.hiro.so');
    });

    function clickActionButton(context: BrowserContext) {
      return async (buttonToPress: 'Cancel' | 'Sign') => {
        const popup = await context.waitForEvent('page');
        const btn = popup.locator(`text="${buttonToPress}"`);
        await btn.click();
      };
    }

    function initiateMessageSigning(page: Page) {
      return async (message: string) =>
        page.evaluate(
          async message =>
            (window as any).HiroWalletProvider.request('signMessage', {
              message,
              paymentType: 'p2wpkh',
            }).catch((e: unknown) => e),
          message
        );
    }

    test('Signature approved', async ({ page, context }) => {
      const [result] = await Promise.all([
        initiateMessageSigning(page)('test'),
        clickActionButton(context)('Sign'),
      ]);

      // ID is random, removed so we can test known values
      delete result.id;

      test.expect(result).toEqual({
        jsonrpc: '2.0',
        result: {
          signature:
            'AkcwRAIgdvIlzioQtCWH+p3yLgHcBOIcHCzK2FysW1sZ6IuS2foCIGZUMUUg8emDxtsE5XZh4CDsVM64jL8SssFMpq0kIaqJASEDYBnHwvCycDDBY1EklpMD4+R6Z+KBIwYMwApNNhWs220=',
          address: 'bc1qhdykvr9eafepm9cf6aryk0stmmwpv4wws9raj5',
          message: 'test',
        },
      });
    });

    test('Signature rejected', async ({ page, context }) => {
      const [result] = await Promise.all([
        initiateMessageSigning(page)('test'),
        clickActionButton(context)('Cancel'),
      ]);

      delete result.id;

      test.expect(result).toEqual({
        jsonrpc: '2.0',
        error: {
          code: 4001,
          message: 'User rejected message signing request',
        },
      });
    });
  }));
