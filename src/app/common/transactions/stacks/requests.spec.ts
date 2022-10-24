import { getAppPrivateKey } from '@stacks/wallet-sdk';
import { STX_TRANSFER_TX_REQUEST, TEST_WALLET } from '@tests/mocks';
import { generateContractCallToken } from '@tests/utils/transation-test-utils';
import { UNAUTHORIZED_TX_REQUEST, verifyTxRequest } from './requests';

describe.skip('verifyTxRequest', () => {
  test('can validate a known valid tx request', async () => {
    const result = await verifyTxRequest({
      requestToken: STX_TRANSFER_TX_REQUEST,
      wallet: TEST_WALLET,
      appDomain: 'http://localhost:3000',
    });
    expect(result.stxAddress).toEqual('ST35Z3YQCTC1WZ8Z7AKHGE91HK05WKMKPTN1KX7Q7');
    expect(result).toBeTruthy();
  });

  test('can validate a generated valid tx request', async () => {
    const [account] = TEST_WALLET.accounts;
    const appPrivateKey = getAppPrivateKey({ account, appDomain: 'http://localhost:3000' });
    const txRequest = await generateContractCallToken({
      userData: {
        appPrivateKey: appPrivateKey,
      },
    });
    const result = await verifyTxRequest({
      requestToken: txRequest,
      wallet: TEST_WALLET,
      appDomain: 'http://localhost:3000',
    });
    expect(result.stxAddress).toBeFalsy();
  });

  test('can invalidate a tx request with an invalid signature', async () => {
    const txRequest = await generateContractCallToken();
    await expect(
      verifyTxRequest({
        requestToken: txRequest,
        wallet: TEST_WALLET,
        appDomain: 'http://localhost:3000',
      })
    ).rejects.toThrow(UNAUTHORIZED_TX_REQUEST);
  });

  test('can invalidate a tx request with non-matching stx address', async () => {
    const [account] = TEST_WALLET.accounts;
    const appPrivateKey = getAppPrivateKey({ account, appDomain: 'http://localhost:3000' });
    const txRequest = await generateContractCallToken({
      userData: {
        appPrivateKey: appPrivateKey,
      },
      txOptions: {
        stxAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      },
    });
    await expect(
      verifyTxRequest({
        requestToken: txRequest,
        wallet: TEST_WALLET,
        appDomain: 'http://localhost:3000',
      })
    ).rejects.toThrow(UNAUTHORIZED_TX_REQUEST);
  });
});
