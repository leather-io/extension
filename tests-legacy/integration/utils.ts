import { ChromiumBrowserContext, chromium } from '@playwright/test';
import { mkdtemp } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { promisify } from 'util';

import { setupMocks } from '../mocks';
import { DemoPage } from '../page-objects/demo.page';

const makeTmpDir = promisify(mkdtemp);

export function createTestSelector<T extends string>(name: T): `[data-testid="${T}"]` {
  return `[data-testid="${name}"]`;
}

export function getCurrentTestName() {
  return expect.getState().currentTestName?.replaceAll(' ', '-');
}

export function randomString(len: number) {
  const charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

async function getBackgroundServiceWorker(context: ChromiumBrowserContext) {
  const existing = context.serviceWorkers();
  if (existing.length) return existing[0];
  return context.waitForEvent('serviceworker');
}

export async function setupBrowser(verbose?: boolean) {
  const extensionPath = join(__dirname, '../../dist');
  const launchArgs: string[] = [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extensions=${extensionPath}`,
    `--no-sandbox`,
  ];
  const tmpDir = await makeTmpDir(join(tmpdir(), 'wallet-data-'));
  const context = (await chromium.launchPersistentContext(tmpDir, {
    args: launchArgs,
    // Extensions cannot be tested in headless mode
    headless: false,
    slowMo: 100,
  })) as ChromiumBrowserContext;

  await context.grantPermissions(['clipboard-read']);
  const backgroundPage = await getBackgroundServiceWorker(context);
  if (process.env.CI) console.log('[DEBUG]: Launched playwright browser');
  await setupMocks(context);
  const demoConsoleLogs: string[] = [];
  const demo = await DemoPage.init(context);
  demo.page.on('pageerror', event => {
    if (verbose) console.log('Demo page error:', event.message);
  });
  demo.page.on('console', event => {
    if (verbose) console.log('Test app console.log', event.text());
    demoConsoleLogs.push(event.text());
  });

  return {
    demoConsoleLogs,
    demo,
    backgroundPage,
    context,
  };
}

export type BrowserDriver = Awaited<ReturnType<typeof setupBrowser>>;

export function timeDifference(startDate: Date, endDate: Date) {
  const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  return seconds;
}
