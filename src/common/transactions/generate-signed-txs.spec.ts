import { decodeToken } from 'jsontokens';
import { TransactionPayload } from '@stacks/connect';
import { PostConditionMode } from '@stacks/transactions';

import { generateContractCallToken } from '@tests/utils/transation-test-utils';
import { generateSignedTransaction } from './generate-signed-txs';

describe('generated signed transactions', () => {
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
