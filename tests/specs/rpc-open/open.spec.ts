import type { BrowserContext, Page } from '@playwright/test';
import { TEST_PASSWORD } from '@tests/mocks/constants';
import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { test } from '../../fixtures/fixtures';

const successResponse = {
  jsonrpc: '2.0',
  result: {
    success: true,
  },
};

async function interceptRequestPopup(context: BrowserContext) {
  return context.waitForEvent('page');
}

async function initiateGetAddresses(page: Page) {
  return page.evaluate(async () => (window as any).LeatherProvider?.request('getAddresses'));
}

async function clickConnectLeatherButton(popup: Page) {
  const button = popup.getByTestId('get-addresses-approve-button');
  await button.click();
}

async function callGetAddresses(page: Page, context: BrowserContext) {
  const getAddressesPromise = initiateGetAddresses(page);
  const getAdressesPopup = await interceptRequestPopup(context);
  await clickConnectLeatherButton(getAdressesPopup);
  await getAddressesPromise;
  await getAdressesPopup.waitForEvent('close');
}

async function assertWalletHomeOpens(popup: Page) {
  await popup.getByTestId(HomePageSelectors.HomePageContainer).waitFor();
  const button = popup.getByTestId(HomePageSelectors.FundAccountBtn);
  await test.expect(button).toBeVisible();
}

async function initiateOpen(page: Page) {
  return page.evaluate(async () =>
    (window as any).LeatherProvider?.request('open').catch((e: any) => e)
  );
}

test.describe('Rpc: Open', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
  });

  test('the wallet opens successfully', async ({ page, context }) => {
    await page.goto('localhost:3000');
    await callGetAddresses(page, context);

    const openPromise = await initiateOpen(page);

    const popup = await interceptRequestPopup(context);
    await assertWalletHomeOpens(popup);

    const result = await openPromise;
    if (!result) throw new Error('Expected result');
    const { id, ...payloadWithoutId } = result;

    test.expect(payloadWithoutId).toEqual(successResponse);
  });

  test('it rejects request when it does not have permission', async ({ page }) => {
    await page.goto('localhost:3000');

    const result = await initiateOpen(page);

    if (!result) throw new Error('Expected result');
    const { id, ...payloadWithoutId } = result;

    test.expect(payloadWithoutId).toEqual({
      jsonrpc: '2.0',
      error: {
        code: 16,
        message: 'Permission denied, user must first connect to the wallet',
      },
    });
  });

  test('it forces user to unlock wallet when wallet is locked', async ({
    homePage,
    page,
    extensionId,
    context,
  }) => {
    await page.goto('localhost:3000');
    await callGetAddresses(page, context);

    await page.goto('chrome-extension://' + extensionId + '/index.html');
    await homePage.lock();

    await page.goto('localhost:3000');

    const openPromise = initiateOpen(page);
    const popup = await interceptRequestPopup(context);
    await popup.getByRole('textbox').fill(TEST_PASSWORD);
    await popup.getByRole('button', { name: 'Continue' }).click();
    await assertWalletHomeOpens(popup);
    await test.expect(openPromise).resolves.toMatchObject(successResponse);
  });
});
