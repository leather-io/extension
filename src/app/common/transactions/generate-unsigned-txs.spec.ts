import { decodeToken } from 'jsontokens';
import { PostConditionMode } from '@stacks/transactions';

import { generateContractCallToken } from '@tests/utils/transation-test-utils';
import { generateUnsignedTransaction } from './generate-unsigned-txs';

describe('generated signed transactions', () => {
  test('can handle encoded payload', async () => {
    const txDataToken = await generateContractCallToken();
    const token = decodeToken(txDataToken);
    const txData = token.payload as unknown as any;
    const tx = await generateUnsignedTransaction({
      txData,
      publicKey: '8721c6a5237f5e8d361161a7855aa56885a3e19e2ea6ee268fb14eabc5e2ed9001',
      nonce: 0,
      fee: 0,
    });
    expect(tx.postConditionMode).toEqual(PostConditionMode.Allow);
    const postCondition = tx.postConditions.values[0];
    expect('amount' in postCondition && postCondition.amount).toEqual(100n);
  }, 5000);
});
