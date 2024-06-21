import BigNumber from 'bignumber.js';
import { sha256 } from 'bitcoinjs-lib/src/crypto';

import type { UtxoResponseItem } from '@leather.io/query';
import { createMoney } from '@leather.io/utils';

import { filterUneconomicalUtxos } from '../utils';
import { calculateMaxBitcoinSpend } from './calculate-max-bitcoin-spend';

function generateTxId(value: number): UtxoResponseItem {
  const buffer = Buffer.from(Math.random().toString());
  return {
    txid: sha256(sha256(buffer)).toString(),
    vout: 0,
    status: {
      confirmed: true,
      block_height: 2568495,
      block_hash: '000000000000008622fafce4a5388861b252d534f819d0f7cb5d4f2c5f9c1638',
      block_time: 1703787327,
    },
    value,
  };
}

function generateTransactions(values: number[]) {
  return values.map(val => generateTxId(val));
}

function generateAverageFee(value: number) {
  return {
    hourFee: BigNumber(value / 2),
    halfHourFee: BigNumber(value),
    fastestFee: BigNumber(value * 2),
  };
}

describe(calculateMaxBitcoinSpend.name, () => {
  const utxos = generateTransactions([600, 600, 1200, 1200, 10000, 10000, 25000, 40000, 50000000]);

  test('with 1 sat/vb fee', () => {
    const fee = 1;
    const maxBitcoinSpend = calculateMaxBitcoinSpend({
      address: '',
      utxos,
      fetchedFeeRates: generateAverageFee(fee),
    });
    expect(maxBitcoinSpend.amount.amount.toNumber()).toEqual(50087948);
  });

  test('with 5 sat/vb fee', () => {
    const fee = 5;
    const maxBitcoinSpend = calculateMaxBitcoinSpend({
      address: '',
      utxos,
      fetchedFeeRates: generateAverageFee(fee),
    });
    expect(maxBitcoinSpend.amount.amount.toNumber()).toEqual(50085342);
  });

  test('with 30 sat/vb fee', () => {
    const fee = 30;
    const maxBitcoinSpend = calculateMaxBitcoinSpend({
      address: '',
      utxos,
      fetchedFeeRates: generateAverageFee(fee),
    });
    expect(maxBitcoinSpend.amount.amount.toNumber()).toEqual(50073585);
  });

  test('with 100 sat/vb fee', () => {
    const fee = 100;
    const maxBitcoinSpend = calculateMaxBitcoinSpend({
      address: '',
      utxos,
      fetchedFeeRates: generateAverageFee(fee),
    });
    expect(maxBitcoinSpend.amount.amount.toNumber()).toEqual(50046950);
  });

  test('with 400 sat/vb fee', () => {
    const fee = 400;
    const maxBitcoinSpend = calculateMaxBitcoinSpend({
      address: '',
      utxos,
      fetchedFeeRates: generateAverageFee(fee),
    });
    expect(maxBitcoinSpend.amount.amount.toNumber()).toEqual(49969100);
  });
});

describe(filterUneconomicalUtxos.name, () => {
  const utxos = generateTransactions([600, 600, 1200, 1200, 10000, 10000, 25000, 40000, 50000000]);
  const recipients = [
    {
      address: '',
      amount: createMoney(0, 'BTC'),
    },
  ];

  test('with 1 sat/vb fee', () => {
    const fee = 1;
    const filteredUtxos = filterUneconomicalUtxos({
      utxos,
      feeRate: fee,
      recipients,
    });

    expect(filteredUtxos.length).toEqual(9);
  });

  test('with 10 sat/vb fee', () => {
    const fee = 10;
    const filteredUtxos = filterUneconomicalUtxos({
      recipients,
      utxos,
      feeRate: fee,
    });
    expect(filteredUtxos.length).toEqual(7);
  });

  test('with 30 sat/vb fee', () => {
    const fee = 30;
    const filteredUtxos = filterUneconomicalUtxos({
      recipients,
      utxos,
      feeRate: fee,
    });
    expect(filteredUtxos.length).toEqual(5);
  });

  test('with 200 sat/vb fee', () => {
    const fee = 200;
    const filteredUtxos = filterUneconomicalUtxos({
      recipients,
      utxos,
      feeRate: fee,
    });
    expect(filteredUtxos.length).toEqual(3);
  });

  test('with 400 sat/vb fee', () => {
    const fee = 400;
    const filteredUtxos = filterUneconomicalUtxos({
      recipients,
      utxos,
      feeRate: fee,
    });
    expect(filteredUtxos.length).toEqual(2);
  });
});
