import { SignPsbtRequestParams } from '@btckit/types';
import { BrowserContext, Page } from '@playwright/test';

import { WalletDefaultNetworkConfigurationIds } from '@shared/constants';

import { test } from '../../fixtures/fixtures';

// TODO: Refactor these tests to create the PSBT instances with btc.Transaction
// rather than using the pre-made hex payload. There is currently an open issue
// with playwright that is preventing us from using btc-signer lib here.
// https://github.com/microsoft/playwright/issues/17075
const unsignedPsbtHex =
  '70736274ff01007b02000000020c9199d8079e6fe8a6c78ac9c4e0311c97c9fcdc8b5586c56d191b6d98c0035e0000000000ffffffff087168f5b929b37a27704d338aa9d0d3508a819f879c244ba12128f04a5b37ef0000000000ffffffff01c800000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d000000000001011f6400000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d0001011f6400000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d0000';

const unsignedPsbtHexWithInputsGreaterThanVoutIndex =
  '70736274ff0100a402000000030c9199d8079e6fe8a6c78ac9c4e0311c97c9fcdc8b5586c56d191b6d98c0035e0000000000ffffffff087168f5b929b37a27704d338aa9d0d3508a819f879c244ba12128f04a5b37ef0000000000ffffffffe608c58e6b047fa25415a7ed757e64a7a6e75bccb760bd6fcaa8e1bc448d3c130000000000ffffffff012c01000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d000000000001011f6400000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d0001011f6400000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d0001011f6400000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d0000';

const signedAllPsbt =
  '70736274ff01007b02000000020c9199d8079e6fe8a6c78ac9c4e0311c97c9fcdc8b5586c56d191b6d98c0035e0000000000ffffffff087168f5b929b37a27704d338aa9d0d3508a819f879c244ba12128f04a5b37ef0000000000ffffffff01c800000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d000000000001011f6400000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d220203fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa5483045022100ea4c2a68f1032102ad2c73504096f5dbd63d242ccce8000aa9db1a0ce4c4c59402204269fdd3536697329ed9bffcf67e3584d2d3426f84bb004fe467286abe7b02d8010001011f6400000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d220203fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa54730440220014950184114126c0cfeef37c87fff342d297c33190fcbd3fb9bf7c960d2bbe3022057554115f480ae984b12d919a505b1f52cfa89e49cd25f25e877db03bc153a77010000';

const signedOnlyIndexZeroPsbt =
  '70736274ff01007b02000000020c9199d8079e6fe8a6c78ac9c4e0311c97c9fcdc8b5586c56d191b6d98c0035e0000000000ffffffff087168f5b929b37a27704d338aa9d0d3508a819f879c244ba12128f04a5b37ef0000000000ffffffff01c800000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d000000000001011f6400000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d220203fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa5483045022100ea4c2a68f1032102ad2c73504096f5dbd63d242ccce8000aa9db1a0ce4c4c59402204269fdd3536697329ed9bffcf67e3584d2d3426f84bb004fe467286abe7b02d8010001011f6400000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d0000';

const signedPsbtHexWithInputsGreaterThanVoutIndex =
  '70736274ff0100a402000000030c9199d8079e6fe8a6c78ac9c4e0311c97c9fcdc8b5586c56d191b6d98c0035e0000000000ffffffff087168f5b929b37a27704d338aa9d0d3508a819f879c244ba12128f04a5b37ef0000000000ffffffffe608c58e6b047fa25415a7ed757e64a7a6e75bccb760bd6fcaa8e1bc448d3c130000000000ffffffff012c01000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d000000000001011f6400000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d220203fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa547304402200185d965db41fd1bd027db3005e4191ad2ca6739ff28a5b34997919175abd8e302205b1414f46aaba7f3ed357fc5336511b843c779f60386b0dad0335a1343dd5d22010001011f6400000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d220203fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa5473044022069b3741082f7aa47cf8ec6fe32d6c9b68852190349abaa2315d3bc1fe3fd672d02200393152db082c9779c9c237247cb14d037295d97a03a612f488697a97bcd919a010001011f6400000000000000160014a8113965cee4d5ffa2d9996a204866a58200131d220203fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa5483045022100d14b0addf0d4f13b57356ab2f680d29cdb5bfa3b9bb916b52b7687467fa015dd0220319dc6a2c2129baec2049ee77effc24292e691d8ac992d187ed0097cae08778d010000';

test.describe('Sign PSBT', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await page.goto('localhost:3000');
  });

  function clickActionButton(context: BrowserContext) {
    return async (buttonToPress: 'Cancel' | 'Confirm') => {
      const popup = await context.waitForEvent('page');
      await popup.waitForTimeout(1000);
      const btn = popup.locator(`text="${buttonToPress}"`);
      await btn.click();
    };
  }

  async function interceptBroadcastRequest(context: BrowserContext) {
    const popup = await context.waitForEvent('page');
    const requestPromise = popup.waitForRequest('**/*/tx');
    await popup.route('**/*/tx', async route => await route.abort());
    return requestPromise;
  }

  const signAllParams = {
    hex: unsignedPsbtHex,
    network: WalletDefaultNetworkConfigurationIds.testnet,
  };

  const signAllParamsWithInputsGreaterThanVoutIndex = {
    hex: unsignedPsbtHexWithInputsGreaterThanVoutIndex,
    network: WalletDefaultNetworkConfigurationIds.testnet,
  };

  const signAtIndexParams = {
    hex: unsignedPsbtHex,
    network: WalletDefaultNetworkConfigurationIds.testnet,
    signAtIndex: 0,
  };

  function initiatePsbtSigning(page: Page) {
    return async (params: SignPsbtRequestParams & { broadcast?: boolean }) =>
      page.evaluate(
        async params =>
          (window as any).LeatherProvider.request('signPsbt', {
            ...params,
          }).catch((e: unknown) => e),
        { ...params }
      );
  }

  test('that all inputs are signed', async ({ page, context }) => {
    const [result] = await Promise.all([
      initiatePsbtSigning(page)(signAllParams),
      clickActionButton(context)('Confirm'),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      result: { hex: signedAllPsbt },
    });
  });

  test('that all inputs are signed even if the number of inputs is greater than vout index', async ({
    page,
    context,
  }) => {
    const [result] = await Promise.all([
      initiatePsbtSigning(page)(signAllParamsWithInputsGreaterThanVoutIndex),
      clickActionButton(context)('Confirm'),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      result: { hex: signedPsbtHexWithInputsGreaterThanVoutIndex },
    });
  });

  test('that only requested inputs are signed', async ({ page, context }) => {
    const [result] = await Promise.all([
      initiatePsbtSigning(page)(signAtIndexParams),
      clickActionButton(context)('Confirm'),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      result: { hex: signedOnlyIndexZeroPsbt },
    });
  });

  test('that the request can be signed and broadcast', async ({ page, context }) => {
    const requestPromise = interceptBroadcastRequest(context);

    const [result] = await Promise.all([
      initiatePsbtSigning(page)({ ...signAllParams, broadcast: true }),
      clickActionButton(context)('Confirm'),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      result: { hex: signedAllPsbt },
    });

    const request = await requestPromise;
    const requestBody = request.postDataBuffer();
    test.expect(requestBody).toBeDefined();
  });

  test('that the request to sign can be canceled', async ({ page, context }) => {
    const [result] = await Promise.all([
      initiatePsbtSigning(page)(signAllParams),
      clickActionButton(context)('Cancel'),
    ]);

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      error: {
        code: 4001,
        message: 'User rejected signing PSBT request',
      },
    });
  });
});
