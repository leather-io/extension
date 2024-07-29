import { BrowserContext, test as base, chromium } from '@playwright/test';
import { FundChooseCurrencyPage } from '@tests/page-object-models/fund-choose-currency.page';
import { GlobalPage } from '@tests/page-object-models/global.page';
import { HomePage } from '@tests/page-object-models/home.page';
import { NetworkPage } from '@tests/page-object-models/network.page';
import { OnboardingPage } from '@tests/page-object-models/onboarding.page';
import { SendPage } from '@tests/page-object-models/send.page';
import { SwapPage } from '@tests/page-object-models/swap.page';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface TestFixtures {
  context: BrowserContext;
  extensionId: string;
  globalPage: GlobalPage;
  homePage: HomePage;
  onboardingPage: OnboardingPage;
  sendPage: SendPage;
  swapPage: SwapPage;
  networkPage: NetworkPage;
  fundChooseCurrencyPage: FundChooseCurrencyPage;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Loads the extension into the browser context. Use this test function with
 * Playwright to avoid having to manually load the extension into the browser
 * context in each test. Created by following,
 * https://playwright.dev/docs/chrome-extensions
 */
export const test = base.extend<TestFixtures>({
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, '../../dist');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      permissions: ['clipboard-read'],
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        // force GPU hardware acceleration
        // (even in headless mode)
        '--use-gl=egl',
      ],
    });
    await use(context);
    await context.close();
    await context.browser()?.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent('serviceworker');
    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
  globalPage: async ({ page }, use) => {
    await use(new GlobalPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  onboardingPage: async ({ page }, use) => {
    await use(new OnboardingPage(page));
  },
  sendPage: async ({ page }, use) => {
    await use(new SendPage(page));
  },
  swapPage: async ({ page }, use) => {
    await use(new SwapPage(page));
  },
  networkPage: async ({ page }, use) => {
    await use(new NetworkPage(page));
  },
  fundChooseCurrencyPage: async ({ page }, use) => {
    await use(new FundChooseCurrencyPage(page));
  },
});
