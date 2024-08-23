import type { BrowserContext, Page } from '@playwright/test';
import { TEST_PASSWORD } from '@tests/mocks/constants';
import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { test } from '../../fixtures/fixtures';

const successResponse = {
  jsonrpc: '2.0',
  result: {
    message: 'Success',
  },
};

async function interceptRequestPopup(context: BrowserContext) {
  return context.waitForEvent('page');
}

async function assertWalletHomeOpens(popup: Page) {
  await popup.getByTestId(HomePageSelectors.HomePageContainer).waitFor();
  const button = popup.getByTestId(HomePageSelectors.FundAccountBtn);
  await test.expect(button).toBeVisible();
}
async function initiateOpen(page: Page) {
  return page.evaluate(async () => (window as any).LeatherProvider?.request('open'));
}

test.describe('Rpc: Open', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage }) => {
    await globalPage.setupAndUseApiCalls(extensionId);

    await onboardingPage.signInWithTestAccount(extensionId);
  });

  test('the wallet opens successfully', async ({ page, context }) => {
    await page.goto('localhost:3000');
    const openPromise = await initiateOpen(page);

    const popup = await interceptRequestPopup(context);
    await assertWalletHomeOpens(popup);

    const result = await openPromise;
    if (!result) throw new Error('Expected result');
    const { id, ...payloadWithoutId } = result;

    await test.expect(payloadWithoutId).toEqual(successResponse);
  });

  test('it forces user to unlock wallet when wallet is locked', async ({
    homePage,
    page,
    context,
  }) => {
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
