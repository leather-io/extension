import { generateSignedTransaction } from '@common/transactions/transactions';
import {
  PostConditionMode,
  makeStandardFungiblePostCondition,
  FungibleConditionCode,
  createAssetInfo,
} from '@stacks/transactions';
import {
  ContractCallOptions,
  makeContractCallToken,
  TransactionPayload,
  UserData,
} from '@stacks/connect';
import BN from 'bn.js';
import { decodeToken } from 'jsontokens';
import { STX_TRANSFER_TX_REQUEST, TEST_WALLET } from '../mocks';
import { getAppPrivateKey } from '@stacks/wallet-sdk';
import { UNAUTHORIZED_TX_REQUEST, verifyTxRequest } from '@common/transactions/requests';
import { StacksTestnet } from '@stacks/network';
import { AddressTransactionWithTransfers, Transaction } from '@stacks/stacks-blockchain-api-types';
import { createTxDateFormatList } from '@common/transactions/transaction-utils';

(window as any).fetch = jest.fn(() => ({
  text: () => Promise.resolve(1),
  ok: true,
}));

const defaultUserSession: Partial<UserData> = {
  appPrivateKey: 'e494f188c2d35887531ba474c433b1e41fadd8eb824aca983447fd4bb8b277a801',
};

async function generateContractCallToken({
  userData,
  txOptions,
}: {
  userData?: Partial<UserData>;
  txOptions?: Partial<ContractCallOptions>;
} = {}) {
  const address = 'ST1EXHZSN8MJSJ9DSG994G1V8CNKYXGMK7Z4SA6DH';
  const assetAddress = 'ST34RKEJKQES7MXQFBT29KSJZD73QK3YNT5N56C6X';
  const assetContractName = 'test-asset-contract';
  const assetName = 'test-asset-name';
  const info = createAssetInfo(assetAddress, assetContractName, assetName);
  localStorage.setItem(
    'blockstack-session',
    JSON.stringify({
      userData: userData || defaultUserSession,
      version: '1.0.0',
    })
  );
  const network = new StacksTestnet();
  const txDataToken = await makeContractCallToken({
    contractAddress: 'ST1EXHZSN8MJSJ9DSG994G1V8CNKYXGMK7Z4SA6DH',
    contractName: 'hello-world',
    functionArgs: [],
    functionName: 'print',
    postConditionMode: PostConditionMode.Allow,
    network,
    postConditions: [
      makeStandardFungiblePostCondition(
        address,
        FungibleConditionCode.GreaterEqual,
        new BN(100),
        info
      ),
    ],
    ...txOptions,
  });
  return txDataToken;
}

describe('generated transactions', () => {
  test('can handle encoded payload', async () => {
    const txDataToken = await generateContractCallToken();
    const token = decodeToken(txDataToken);
    const txData = token.payload as unknown as TransactionPayload;
    const tx = await generateSignedTransaction({
      txData,
      senderKey: '8721c6a5237f5e8d361161a7855aa56885a3e19e2ea6ee268fb14eabc5e2ed9001',
      nonce: 0,
    } as any);
    expect(tx.postConditionMode).toEqual(PostConditionMode.Allow);
    const postCondition = tx.postConditions.values[0];
    if ('amount' in postCondition) {
      expect(postCondition.amount.toNumber()).toEqual(100);
    } else {
      throw new Error('Deserialized TX does not have post condition');
    }
  }, 5000);
});

describe('verifyTxRequest', () => {
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

function createFakeTx(tx: Partial<Transaction>) {
  return {
    tx: { tx_status: 'success', ...tx } as Transaction,
  } as AddressTransactionWithTransfers;
}

describe(createTxDateFormatList.name, () => {
  test('grouping by date', () => {
    const mockTx = createFakeTx({
      burn_block_time_iso: '1991-02-08T13:48:04.699Z',
    });
    expect(createTxDateFormatList([mockTx])).toEqual([
      {
        date: '1991-02-08',
        displayDate: 'Feb 8th, 1991',
        txs: [mockTx],
      },
    ]);
  });

  test('relative dates todays date', () => {
    const today = new Date().toISOString();
    const mockTx = createFakeTx({ burn_block_time_iso: today });
    const result = createTxDateFormatList([mockTx]);
    expect(result[0].date).toEqual(today.split('T')[0]);
    expect(result[0].displayDate).toEqual('Today');
  });

  test('relative dates yesterdays date', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const mockTx = createFakeTx({ burn_block_time_iso: yesterday.toISOString() });
    const result = createTxDateFormatList([mockTx]);
    expect(result[0].date).toEqual(yesterday.toISOString().split('T')[0]);
    expect(result[0].displayDate).toEqual('Yesterday');
  });

  test('dates from this year omit year', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear());
    date.setMonth(6);
    const mockTx = createFakeTx({ burn_block_time_iso: date.toISOString() });
    const result = createTxDateFormatList([mockTx]);
    expect(result[0].date).toEqual(date.toISOString().split('T')[0]);
    expect(result[0].displayDate).not.toContain(new Date().getFullYear().toString());
  });
});
