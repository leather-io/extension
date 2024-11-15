import type { BrowserContext, Page, Route } from '@playwright/test';

import { delay } from '@leather.io/utils';

import { test } from '../../fixtures/fixtures';

function mockChainalysisEntityRegistrationRequest(context: BrowserContext) {
  return async (routeHandler: (route: Route) => void) => {
    return context.route('https://api.chainalysis.com/api/risk/v2/entities', async route =>
      routeHandler(route)
    );
  };
}

function mockChainalysisEntityCheckRequest(context: BrowserContext) {
  return async (routeHandler: (route: Route) => void) => {
    return context.route('https://api.chainalysis.com/api/risk/v2/entities/*', async route =>
      routeHandler(route)
    );
  };
}

test.describe('Compliance checks', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await page.goto('localhost:3000', { waitUntil: 'networkidle' });
  });

  async function openIllegalTransfer(page: Page) {
    return page.evaluate(
      () =>
        // We only want the page window, don't wait for actual promise to finish
        void (window as any).LeatherProvider.request('sendTransfer', {
          // Known address from list, in readme of this
          // page https://github.com/0xB10C/ofac-sanctioned-digital-currency-addresses
          address: '12QtD5BFwRsdNsAZY76UVE1xyCGNTojH9h',
          amount: '1231',
        }).catch((e: unknown) => e)
    );
  }

  test('that it errors if non-compliant entity is detected', async ({ page, context }) => {
    await mockChainalysisEntityRegistrationRequest(context)(route =>
      route.fulfill({ json: { address: '12QtD5BFwRsdNsAZY76UVE1xyCGNTojH9h' } })
    );
    await mockChainalysisEntityCheckRequest(context)(route =>
      route.fulfill({ json: { risk: 'Severe' } })
    );

    const [leatherApprover] = await Promise.all([
      context.waitForEvent('page'),
      openIllegalTransfer(page),
    ]);

    await test
      .expect(leatherApprover.getByText('Unable to handle request, errorCode: 1398'))
      .toBeVisible();
  });

  test('nothing happens when chainalysis is down', async ({ page, context }) => {
    await mockChainalysisEntityCheckRequest(context)(route => route.abort());
    await mockChainalysisEntityRegistrationRequest(context)(route => route.abort());

    const [leatherApprover] = await Promise.all([
      context.waitForEvent('page'),
      openIllegalTransfer(page),
    ]);

    await test
      .expect(leatherApprover.locator('text="Unable to handle request, errorCode: 1398"'))
      .toBeHidden();

    await test.expect(leatherApprover.locator('text="0.00001231 BTC"')).toBeVisible();
  });

  test('the addresses of all recipients are checked', async ({ context, page }) => {
    let entityCheckCount = 0;

    await mockChainalysisEntityCheckRequest(context)(route => {
      entityCheckCount += 1;
      return route.abort();
    });

    await Promise.all([context.waitForEvent('page'), openIllegalTransfer(page)]);

    // Please forgive this timeout, we need to give the page time in order to
    // make the request, to be sure it was made. If this test ends up failing
    // due to a race condition, please let the author know.
    await delay(2000);

    const userAndRecipientAddressCount = 2;

    test.expect(entityCheckCount).toEqual(userAndRecipientAddressCount);
  });
});
