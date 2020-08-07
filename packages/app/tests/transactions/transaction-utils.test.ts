import { generateTransaction } from '../../src/common/transaction-utils';
import { Wallet } from '@blockstack/keychain';
import {
  ChainID,
  PostConditionMode,
  makeStandardFungiblePostCondition,
  FungibleConditionCode,
} from '@blockstack/stacks-transactions';
import { makeContractCallToken, TransactionPayload } from '../../../../packages/connect/src/index';
import * as BigNum from 'bn.js';
import { decodeToken } from 'blockstack';

describe('generated transactions', () => {
  test('can handle encoded payload', async () => {
    const wallet = await Wallet.restore('password', 'secretkey', ChainID.Mainnet);
    const txDataToken = await makeContractCallToken({
      contractAddress: 'ST1GZ804XH4240T4JT2GQ34GG0DMT6B3BQ5YQX2WX',
      contractName: 'hello-world',
      functionArgs: [],
      functionName: 'print',
      postConditionMode: PostConditionMode.Allow,
      postConditions: [
        makeStandardFungiblePostCondition(
          'ST1GZ804XH4240T4JT2GQ34GG0DMT6B3BQ5YQX2WX',
          FungibleConditionCode.GreaterEqual,
          new BigNum(100),
          'token'
        ),
      ],
    });
    const token = decodeToken(txDataToken);
    const txData = (token.payload as unknown) as TransactionPayload;
    const tx = await generateTransaction({ txData, wallet, nonce: 1 });
    expect(tx.postConditionMode).toEqual(PostConditionMode.Allow);
    expect(tx.postConditions.values[0]).toEqual('102');
  });
});
