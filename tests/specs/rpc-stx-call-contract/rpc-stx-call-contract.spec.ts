import { BrowserContext, Page } from '@playwright/test';
import {
  type ClarityValue,
  bufferCVFromString,
  noneCV,
  serializeCV,
  standardPrincipalCV,
} from '@stacks/transactions';
import { TEST_ACCOUNT_2_STX_ADDRESS } from '@tests/mocks/constants';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import type { RpcParams, stxCallContract } from '@leather.io/rpc';

import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';

import { test } from '../../fixtures/fixtures';

test.describe('RPC: stx_callContract', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await page.goto('localhost:3000', { waitUntil: 'networkidle' });
  });

  function checkVisibleContentWithNoPostConditions(context: BrowserContext) {
    return async (buttonToPress: 'Cancel' | 'Confirm') => {
      const popup = await context.waitForEvent('page');

      const displayerAddress = await popup
        .getByTestId(SharedComponentsSelectors.AddressDisplayer)
        .innerText()
        .then((value: string) => value.replaceAll('\n', ''));
      test.expect(displayerAddress).toEqual('SP000000000000000000002Q6VF78');

      await popup.waitForSelector(
        'text="Only fees will be transferred from your account or the transaction will abort."'
      );
      await popup.waitForSelector('text="bns"');
      await popup.waitForSelector('text="name-transfer"');
      await popup.waitForSelector('text="0x6964"');
      await popup.waitForSelector('text="0x74657374"');
      await popup.waitForSelector('text="SPXH3HNBPM5YP15VH16ZXZ9AX6CK289K3MCXRKCB"');
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

  function checkVisiblePostConditions(context: BrowserContext) {
    return async (buttonToPress: 'Cancel' | 'Confirm') => {
      const popup = await context.waitForEvent('page');
      await popup.waitForSelector(
        'text="The contract will transfer exactly 0.000042 STX or the transaction will abort."'
      );
      await popup.waitForTimeout(500);
      const btn = popup.locator('text="Confirm"');

      if (buttonToPress === 'Confirm') {
        await btn.click();
      } else {
        await popup.close();
      }
    };
  }

  function checkVisiblePostConditionModeWarning(context: BrowserContext) {
    return async (buttonToPress: 'Cancel' | 'Confirm') => {
      const popup = await context.waitForEvent('page');
      await popup.waitForSelector('text="This transaction can transfer any of your assets"');
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

  test('call contract with no post conditions', async ({ page, context }) => {
    const args: ClarityValue[] = [
      bufferCVFromString('id'), // namespace
      bufferCVFromString('test'), // name
      standardPrincipalCV(TEST_ACCOUNT_2_STX_ADDRESS), // recipient
      noneCV(), // zonefile
    ];

    const [result] = await Promise.all([
      initiateSip30RpcCallContract(page)({
        contract: 'SP000000000000000000002Q6VF78.bns',
        functionName: 'name-transfer',
        functionArgs: args.map(arg => serializeCV(arg)),
      }),
      checkVisibleContentWithNoPostConditions(context)('Cancel'),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      error: {
        code: 4001,
        message: RpcErrorMessage.UserRejectedOperation,
      },
    });
  });

  test('call contract with post conditions', async ({ page, context }) => {
    const [result] = await Promise.all([
      initiateSip30RpcCallContract(page)({
        contract: 'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3.dull-sapphire-bird',
        functionName: 'buy',
        functionArgs: ['010000000000000000000000000000002a'],
        network: 'testnet',
        postConditions: ['00021a8813c5086ddf53beada66744d40b1dcd0ac1d42001000000000000002a'],
      }),
      checkVisiblePostConditions(context)('Cancel'),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      error: {
        code: 4001,
        message: RpcErrorMessage.UserRejectedOperation,
      },
    });
  });

  test('call contract shows warning for post condition mode', async ({ page, context }) => {
    const [result] = await Promise.all([
      initiateSip30RpcCallContract(page)({
        contract: 'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3.dull-sapphire-bird',
        functionName: 'buy',
        functionArgs: ['010000000000000000000000000000002a'],
        postConditions: [],
        postConditionMode: 'allow',
      }),
      checkVisiblePostConditionModeWarning(context)('Cancel'),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      error: {
        code: 4001,
        message: RpcErrorMessage.UserRejectedOperation,
      },
    });
  });
});
