import { BrowserContext, Page, type Route } from '@playwright/test';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import * as btc from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';
import { TEST_ACCOUNT_SECRET_KEY } from '@tests/page-object-models/onboarding.page';

import {
  type BtcSignerNetwork,
  makeNativeSegwitAddressIndexDerivationPath,
} from '@leather.io/bitcoin';
import type { RpcParams, signPsbt } from '@leather.io/rpc';

import { test } from '../../fixtures/fixtures';

function createKeychainFromTestMnmeonic() {
  const seed = mnemonicToSeedSync(TEST_ACCOUNT_SECRET_KEY);
  const keychain = HDKey.fromMasterSeed(seed);
  return keychain.derive(makeNativeSegwitAddressIndexDerivationPath('testnet', 0, 0));
}

test.describe('Sign PSBT', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await page.goto('localhost:3000');
  });

  const addressKeychain = createKeychainFromTestMnmeonic();
  if (!addressKeychain.publicKey) throw new Error('No publicKey');

  const bitcoinTestnet: BtcSignerNetwork = {
    bech32: 'tb',
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
  };

  function createTestPsbt() {
    const psbt = new btc.Transaction();
    psbt.addInput({
      txid: '2965dc62a012028b529c902da59606d65d35353c966aeaf9287f534547609f5f',
      index: 1,
      witnessUtxo: {
        amount: 4805n,
        script: btc.p2wpkh(addressKeychain.publicKey!, bitcoinTestnet).script,
      },
    });

    psbt.addInput({
      txid: '2f8d36ef381ae03a7613ff9f91088a2072363a0ef4c83a51c1fed0a3230869fe',
      index: 1,
      witnessUtxo: {
        amount: 15855487n,
        script: btc.p2wpkh(addressKeychain.publicKey!, bitcoinTestnet).script,
      },
    });

    psbt.addOutputAddress('tb1q4qgnjewwun2llgken94zqjrx5kpqqycaz5522d', 1000n, bitcoinTestnet);
    return psbt;
  }

  function clickActionButton(context: BrowserContext) {
    return async (buttonToPress: 'Cancel' | 'Confirm') => {
      const popup = await context.waitForEvent('page');
      await popup.waitForTimeout(1000);
      const btn = popup.locator(`text="${buttonToPress}"`);
      await btn.click();
    };
  }

  async function clickErrorCloseWindowButton(context: BrowserContext) {
    const popup = await context.waitForEvent('page');
    await popup.waitForTimeout(1000);
    const errorMsg = popup.locator('text="Failed to sign"');
    const btn = popup.locator('text="Close window"');
    test.expect(errorMsg).toBeTruthy();
    await btn.click();
  }

  async function interceptBroadcastRequest(
    context: BrowserContext,
    callback: (route: Route) => Promise<void>
  ) {
    const popup = await context.waitForEvent('page');
    const requestPromise = popup.waitForRequest('**/api/tx');
    await popup.route('**/api/tx', async route => await callback(route));
    return requestPromise;
  }

  function initiatePsbtSigning(page: Page) {
    return async (params: RpcParams<typeof signPsbt> & { broadcast?: boolean }) =>
      page.evaluate(
        async params =>
          (window as any).LeatherProvider.request('signPsbt', {
            ...params,
          }).catch((e: unknown) => e),
        { ...params }
      );
  }

  function createExpectedResult(hex: string, txid?: string) {
    return {
      jsonrpc: '2.0',
      result: txid ? { hex, txid } : { hex },
    };
  }

  function createExpectedError(code: number, message: string) {
    return {
      jsonrpc: '2.0',
      error: { code, message },
    };
  }

  // Hard coded result of tx above
  const unsignedPsbtHexWithTwoInputs =
    '70736274ff01007b02000000025f9f604745537f28f9ea6a963c35355dd60696a52d909c528b0212a062dc65290100000000fffffffffe690823a3d0fec1513ac8f40e3a3672208a08919fff13763ae01a38ef368d2f0100000000ffffffff01e803000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d000000000001011fc512000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d0001011f7feff10000000000160014a8113965cee4d5ffa2d9996a204866a58200131d0000';

  test.expect(bytesToHex(createTestPsbt().toPSBT())).toEqual(unsignedPsbtHexWithTwoInputs);

  test('that all inputs are signed even if the number of inputs is greater than vout index', async ({
    page,
    context,
  }) => {
    const psbt = createTestPsbt();
    const reqPromise = interceptBroadcastRequest(context, route =>
      route.fulfill({
        body: 'not-a-real-txid-response',
      })
    );
    const [result] = await Promise.all([
      initiatePsbtSigning(page)({
        network: 'testnet',
        hex: bytesToHex(psbt.toPSBT()),
        broadcast: true,
      }),
      clickActionButton(context)('Confirm'),
    ]);

    await reqPromise;

    delete result.id;

    psbt.sign(addressKeychain.privateKey!);

    test
      .expect(result)
      .toEqual(createExpectedResult(bytesToHex(psbt.toPSBT()), 'not-a-real-txid-response'));
  });

  test('that only requested inputs are signed', async ({ page, context }) => {
    const psbt = createTestPsbt();
    const [result] = await Promise.all([
      initiatePsbtSigning(page)({
        network: 'testnet',
        hex: bytesToHex(psbt.toPSBT()),
        signAtIndex: 0,
        broadcast: false,
      }),
      clickActionButton(context)('Confirm'),
    ]);

    delete result.id;

    psbt.signIdx(addressKeychain.privateKey!, 0);

    test.expect(result).toEqual(createExpectedResult(bytesToHex(psbt.toPSBT())));
  });

  test('that the request can be signed and broadcast', async ({ page, context }) => {
    const psbt = createTestPsbt();
    const requestPromise = interceptBroadcastRequest(context, route =>
      route.fulfill({
        body: 'not-a-real-txid-response',
      })
    );

    const [result] = await Promise.all([
      initiatePsbtSigning(page)({
        network: 'testnet',
        hex: bytesToHex(psbt.toPSBT()),
        broadcast: true,
      }),
      clickActionButton(context)('Confirm'),
    ]);

    await requestPromise;

    delete result.id;

    psbt.signIdx(addressKeychain.privateKey!, 0);

    test
      .expect(result)
      .toEqual(
        createExpectedResult(
          '70736274ff01007b02000000025f9f604745537f28f9ea6a963c35355dd60696a52d909c528b0212a062dc65290100000000fffffffffe690823a3d0fec1513ac8f40e3a3672208a08919fff13763ae01a38ef368d2f0100000000ffffffff01e803000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d000000000001011fc512000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d220203fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa5483045022100d3019073de66ea52a3c93edc9a1b8bb1c9f64902ade9983c588abb45ee5db04d02201011e4b245b115c6f5a80c3ae540f4a9e8c0fa52ca0a459d461917907385cfa7010001011f7feff10000000000160014a8113965cee4d5ffa2d9996a204866a58200131d220203fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa54730440220092a70ffba140cf72576969b22e7da9b510ece28365f558724aab1b80daf952c0220524f8dff67bc5661f5c95043e02ffd926bc9ee53042195fcbd7cd6aad37848dc010000',
          'not-a-real-txid-response'
        )
      );

    psbt.sign(addressKeychain.privateKey!);

    test
      .expect(result)
      .toEqual(createExpectedResult(bytesToHex(psbt.toPSBT()), 'not-a-real-txid-response'));

    const request = await requestPromise;
    const requestBody = request.postDataBuffer();
    test.expect(requestBody).toBeDefined();
  });

  test('that the request to sign can be canceled', async ({ page, context }) => {
    const psbt = createTestPsbt();
    const [result] = await Promise.all([
      initiatePsbtSigning(page)({
        network: 'testnet',
        hex: bytesToHex(psbt.toPSBT()),
        broadcast: false,
      }),
      clickActionButton(context)('Cancel'),
    ]);

    delete result.id;

    test.expect(result).toEqual(createExpectedError(4001, 'User rejected signing PSBT request'));
  });

  test('that a failed request occurs if an invalid index is provided', async ({
    page,
    context,
  }) => {
    const psbt = createTestPsbt();

    const [result] = await Promise.all([
      initiatePsbtSigning(page)({
        network: 'testnet',
        hex: bytesToHex(psbt.toPSBT()),
        signAtIndex: 4,
        broadcast: false,
      }),
      clickActionButton(context)('Confirm'),
      clickErrorCloseWindowButton(context),
    ]);

    delete result.id;

    test.expect(result).toEqual(createExpectedError(4001, 'User rejected signing PSBT request'));
  });

  test('that failed broadcasts return an error to the app', async ({ page, context }) => {
    const psbt = createTestPsbt();
    const requestPromise = interceptBroadcastRequest(context, route =>
      route.fulfill({ status: 500 })
    );

    const [result] = await Promise.all([
      initiatePsbtSigning(page)({
        network: 'testnet',
        hex: bytesToHex(psbt.toPSBT()),
        broadcast: true,
      }),
      clickActionButton(context)('Confirm'),
    ]);

    await requestPromise;

    delete result.id;

    test.expect(result).toEqual(createExpectedError(4002, 'Failed to broadcast transaction'));
  });
});
