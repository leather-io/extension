import type { BrowserContext, Page } from '@playwright/test';
import { TEST_PASSWORD } from '@tests/mocks/constants';
import { HomePageSelectors } from '@tests/selectors/home.selectors';

import type { SupportedBlockchains } from '@leather.io/models';

import { test } from '../../fixtures/fixtures';

function softwareBeforeEach() {
  return () =>
    test.beforeEach(
      async ({ extensionId, onboardingPage }) =>
        await onboardingPage.signInWithTestAccount(extensionId)
    );
}

function getExpectedResponseForKeys(keys: SupportedBlockchains[]) {
  const bitcoinKeys = [
    {
      symbol: 'BTC',
      type: 'p2wpkh',
      address: 'bc1q530dz4h80kwlzywlhx2qn0k6vdtftd93c499yq',
      publicKey: '030347be500a8b2707a00e7576c0c527a247cddc6e8363ee51147b8e43b590baa9',
      derivationPath: "m/84'/0'/0'/0/0",
    },
    {
      symbol: 'BTC',
      type: 'p2tr',
      address: 'bc1putuzj9lyfcm8fef9jpy85nmh33cxuq9u6wyuk536t9kemdk37yjqmkc0pg',
      publicKey: '0347b913aed4ee088b6fea3e9537836a1c8f1b72111cf010af5589d93f3a433f02',
      tweakedPublicKey: '47b913aed4ee088b6fea3e9537836a1c8f1b72111cf010af5589d93f3a433f02',
      derivationPath: "m/86'/0'/0'/0/0",
    },
  ];
  const stacksKeys = [
    {
      symbol: 'STX',
      publicKey: '0329b076bc20f7b1592b2a1a5cb91dfefe8c966e50e256458e23dd2c5d63f8f1af',
      address: 'SPS8CKF63P16J28AYF7PXW9E5AACH0NZNTEFWSFE',
    },
  ];
  return {
    jsonrpc: '2.0',
    result: {
      addresses: [
        ...(keys.includes('bitcoin') ? bitcoinKeys : []),
        ...(keys.includes('stacks') ? stacksKeys : []),
      ],
    },
  };
}

async function interceptRequestPopup(context: BrowserContext) {
  return context.waitForEvent('page');
}

async function assertWalletHomeOpens(popup: Page) {
  await popup.getByTestId(HomePageSelectors.HomePageContainer).waitFor();
  // await page.getByTestId(HomePageSelectors.HomePageContainer).waitFor();
  const button = popup.getByTestId(HomePageSelectors.FundAccountBtn);
  await test.expect(button).toBeVisible();
  await button.click();
}
async function initiateOpenWallet(page: Page) {
  return page.evaluate(async () => (window as any).LeatherProvider?.request('openWallet'));
}

test.describe('Rpc: OpenWallet', () => {
  test.beforeEach(
    async ({ extensionId, globalPage }) => await globalPage.setupAndUseApiCalls(extensionId)
  );

  const specs = {
    softwareWallet: {
      beforeEach: softwareBeforeEach(),
      expectedResult: getExpectedResponseForKeys(['bitcoin', 'stacks']),
    },
  } as const;

  for (const [walletPreset, { beforeEach, expectedResult }] of Object.entries(specs)) {
    test.describe(`${walletPreset} `, () => {
      beforeEach();

      test('the promise resolves with addresses successfully', async ({ page, context }) => {
        await page.goto('localhost:3000');
        const openWalletPromise = initiateOpenWallet(page);

        const popup = await interceptRequestPopup(context);
        await assertWalletHomeOpens(popup);

        const result = await openWalletPromise;
        if (!result) throw new Error('Expected result');
        const { id, ...payloadWithoutId } = result;
        // console.log('result');

        test.expect(payloadWithoutId).toEqual(expectedResult);
      });

      test('the promise rejects when user closes popup window', async ({ page, context }) => {
        await page.goto('localhost:3000');
        const openWalletPromise = initiateOpenWallet(page);
        const popup = await interceptRequestPopup(context);
        await popup.close();
        await test.expect(openWalletPromise).rejects.toThrow();
      });

      if (walletPreset === 'softwareWallet') {
        test('it redirects back to get addresses flow when wallet is locked', async ({
          homePage,
          page,
          context,
        }) => {
          await homePage.lock();
          await page.goto('localhost:3000');
          const openWalletPromise = initiateOpenWallet(page);
          const popup = await interceptRequestPopup(context);
          await popup.getByRole('textbox').fill(TEST_PASSWORD);
          await popup.getByRole('button', { name: 'Continue' }).click();
          await test.expect(popup.getByText('Connect Leather')).toBeVisible();
          await assertWalletHomeOpens(popup);
          await test.expect(openWalletPromise).resolves.toMatchObject(expectedResult);
        });
      }
    });
  }
});
