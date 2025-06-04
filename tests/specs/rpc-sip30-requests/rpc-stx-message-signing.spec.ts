import { BrowserContext, Page } from '@playwright/test';
import {
  intCV,
  serializeCV,
  stringAsciiCV,
  stringUtf8CV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';

import { test } from '../../fixtures/fixtures';

test.describe('stx_signMessage', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await page.goto('localhost:3000', { waitUntil: 'networkidle' });
  });

  function clickActionButton(context: BrowserContext) {
    return async (buttonToPress: 'Cancel' | 'Sign') => {
      const popup = await context.waitForEvent('page');
      const btn = popup.locator(`text="${buttonToPress}"`);
      await btn.click();
    };
  }

  function initiateUtf8MessageSigning(page: Page) {
    return async (message: string) =>
      page.evaluate(
        async ({ message }) =>
          (window as any).LeatherProvider.request('stx_signMessage', {
            message,
            messageType: 'utf8',
          }).catch((e: unknown) => e),
        { message }
      );
  }

  test.describe('MessageType: utf8', () => {
    test('Signature approved', async ({ page, context }) => {
      const [result] = await Promise.all([
        initiateUtf8MessageSigning(page)('test'),
        clickActionButton(context)('Sign'),
      ]);

      // ID is random, removed so we can test known values
      delete result.id;

      test.expect(result).toEqual({
        jsonrpc: '2.0',
        result: {
          publicKey: '0329b076bc20f7b1592b2a1a5cb91dfefe8c966e50e256458e23dd2c5d63f8f1af',
          signature:
            '6d9040912574f9a8128ada79968e9b09e9d469fe84cda063701be0fefb8c3bdc21a309456a78929347a095a4a856271bde9cb327132edad7730d29404dba5e9300',
        },
      });
    });
  });

  test.describe('MessageType: structured', () => {
    const domain = tupleCV({
      name: stringAsciiCV('leather.io'),
      version: stringAsciiCV('1.0.0'),
      'chain-id': uintCV(1),
    });

    function initiateStxStructuredMessageSigning(page: Page) {
      return async (message: string, domain: string) =>
        page.evaluate(
          async ({ message, domain }) =>
            (window as any).LeatherProvider.request('stx_signMessage', {
              message,
              domain,
              messageType: 'structured',
            }).catch((e: unknown) => e),
          { message, domain }
        );
    }

    test('Signature approved', async ({ page, context }) => {
      const [result] = await Promise.all([
        initiateStxStructuredMessageSigning(page)(
          serializeCV(tupleCV({ a: intCV(-1), b: stringUtf8CV('this is a structured message') })),
          serializeCV(domain)
        ),
        clickActionButton(context)('Sign'),
      ]);

      // ID is random, removed so we can test known values
      delete result.id;

      test.expect(result).toEqual({
        jsonrpc: '2.0',
        result: {
          publicKey: '0329b076bc20f7b1592b2a1a5cb91dfefe8c966e50e256458e23dd2c5d63f8f1af',
          signature:
            '9ed8ab4861d5e99f410ac57692feba7f78336602df80908f11c71c400faad03327c3009daf0b4ee4f05c966197ba0ad92d0e0879b6399c3532c148c32fb4e07c01',
        },
      });
    });
  });

  test('Signature rejected', async ({ page, context }) => {
    const [result] = await Promise.all([
      initiateUtf8MessageSigning(page)('test'),
      clickActionButton(context)('Cancel'),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      error: {
        code: 4001,
        message: 'User denied signing',
      },
    });
  });
});
