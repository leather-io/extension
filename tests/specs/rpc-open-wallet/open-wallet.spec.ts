import type { BrowserContext, Page } from '@playwright/test';

// import { TEST_PASSWORD } from '@tests/mocks/constants';
import { test } from '../../fixtures/fixtures';

function softwareBeforeEach() {
  return () =>
    test.beforeEach(async ({ extensionId, onboardingPage, globalPage }) => {
      await globalPage.setupAndUseApiCalls(extensionId);
      await onboardingPage.signInWithTestAccount(extensionId);
    });
}

async function interceptRequestPopup(context: BrowserContext) {
  return context.waitForEvent('page');
}

async function initiateOpenWallet(page: Page) {
  return page.evaluate(async () => (window as any).LeatherProvider?.request('openWallet'));
}

async function clickFundAccountButton(popup: Page) {
  // const button = popup.getByText('Connect Leather');
  const button = popup.getByTestId('fund-account-btn');
  await test.expect(button).toBeVisible();
  await button.click();
}

test.describe('Rpc: OpenWallet', () => {
  // test.beforeAll(async ({ extensionId, globalPage }) => {
  //   await globalPage.setupAndUseApiCalls(extensionId);
  // });

  // test.describe(`Open Wallet `, () => {
  softwareBeforeEach();

  test('the promise resolves with addresses successfully', async ({ page, context }) => {
    await page.goto('localhost:3000');
    const openWalletPromise = initiateOpenWallet(page);

    const popup = await interceptRequestPopup(context);
    await clickFundAccountButton(popup);

    const result = await openWalletPromise;
    if (!result) throw new Error('Expected result');
    const { id, ...payloadWithoutId } = result;

    test.expect(payloadWithoutId).toEqual(null);
  });

  test('the promise rejects when user closes popup window', async ({ page, context }) => {
    await page.goto('localhost:3000');
    const getAddressesPromise = initiateOpenWallet(page);
    const popup = await interceptRequestPopup(context);
    await popup.close();
    await test.expect(getAddressesPromise).rejects.toThrow();
  });

  //   test('it redirects back to get addresses flow when wallet is locked', async ({
  //     homePage,
  //     page,
  //     context,
  //   }) => {
  //     await homePage.lock();
  //     await page.goto('localhost:3000');
  //     const getAddressesPromise = initiateOpenWallet(page);
  //     const popup = await interceptRequestPopup(context);
  //     await popup.getByRole('textbox').fill(TEST_PASSWORD);
  //     await popup.getByRole('button', { name: 'Continue' }).click();
  //     await test.expect(popup.getByText('Connect Leather')).toBeVisible();
  //     await clickFundAccountButton(popup);
  //     await test.expect(getAddressesPromise).resolves.toMatchObject({});
  //   });
  // });
});
