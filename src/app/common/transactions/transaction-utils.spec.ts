import { ChainID } from '@stacks/transactions';
import { AddressTransactionWithTransfers, Transaction } from '@stacks/stacks-blockchain-api-types';

import { whenChainId } from '@app/common/utils';

import { createTxDateFormatList } from './transaction-utils';

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

describe(whenChainId.name, () => {
  const expectedResult = 'should be this value';
  test('that it returns testnet when given a testnet chain id', () => {
    expect(
      whenChainId(ChainID.Testnet)({
        [ChainID.Testnet]: expectedResult,
        [ChainID.Mainnet]: 'One plus one equals two.',
      })
    ).toEqual(expectedResult);
  });
  test('that it returns mainnet when given a mainnet chain id', () => {
    const expectedResult = 'should be this value';
    expect(
      whenChainId(ChainID.Mainnet)({
        [ChainID.Testnet]: 'The capital city of Mongolia is Ulaanbaatar.',
        [ChainID.Mainnet]: expectedResult,
      })
    ).toEqual(expectedResult);
  });
});
