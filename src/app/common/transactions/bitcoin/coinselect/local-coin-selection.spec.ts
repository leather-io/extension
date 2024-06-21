import { BTC_P2WPKH_DUST_AMOUNT } from '@leather.io/constants';
import { createMoney, createNullArrayOfLength, sumNumbers } from '@leather.io/utils';

import { determineUtxosForSpend } from './local-coin-selection';

const demoUtxos = [
  { value: 8200 },
  { value: 8490 },
  { value: 8790 },
  { value: 19 },
  { value: 2000 },
  { value: 2340 },
  { value: 1230 },
  { value: 120 },
  { value: 8 },
  { value: 1002 },
  { value: 1382 },
  { value: 1400 },
  { value: 909 },
];

function generate10kSpendWithDummyUtxoSet(recipient: string) {
  return determineUtxosForSpend({
    utxos: demoUtxos as any,
    feeRate: 20,
    recipients: [{ address: recipient, amount: createMoney(10_000, 'BTC') }],
  });
}

describe(determineUtxosForSpend.name, () => {
  describe('Estimated size', () => {
    test('that Native Segwit, 1 input 2 outputs weighs 140 vBytes', () => {
      const estimation = determineUtxosForSpend({
        utxos: [{ value: 50_000 }] as any[],
        recipients: [
          {
            address: 'tb1qt28eagxcl9gvhq2rpj5slg7dwgxae2dn2hk93m',
            amount: createMoney(40_000, 'BTC'),
          },
        ],
        feeRate: 20,
      });
      console.log(estimation);
      expect(estimation.txVBytes).toBeGreaterThan(140);
      expect(estimation.txVBytes).toBeLessThan(142);
    });

    test('that Native Segwit, 2 input 2 outputs weighs 200vBytes', () => {
      const estimation = determineUtxosForSpend({
        utxos: [{ value: 50_000 }, { value: 50_000 }] as any[],
        recipients: [
          {
            address: 'tb1qt28eagxcl9gvhq2rpj5slg7dwgxae2dn2hk93m',
            amount: createMoney(60_000, 'BTC'),
          },
        ],
        feeRate: 20,
      });
      console.log(estimation);
      expect(estimation.txVBytes).toBeGreaterThan(208);
      expect(estimation.txVBytes).toBeLessThan(209);
    });

    test('that Native Segwit, 10 input 2 outputs weighs 200vBytes', () => {
      const estimation = determineUtxosForSpend({
        utxos: [
          { value: 20_000 },
          { value: 20_000 },
          { value: 10_000 },
          { value: 10_000 },
          { value: 10_000 },
          { value: 10_000 },
          { value: 10_000 },
          { value: 10_000 },
          { value: 10_000 },
          { value: 10_000 },
        ] as any[],
        recipients: [
          {
            address: 'tb1qt28eagxcl9gvhq2rpj5slg7dwgxae2dn2hk93m',
            amount: createMoney(100_000, 'BTC'),
          },
        ],
        feeRate: 20,
      });
      expect(estimation.txVBytes).toBeGreaterThan(750);
      expect(estimation.txVBytes).toBeLessThan(751);
    });
  });

  describe('sorting algorithm', () => {
    test('that it filters out dust utxos', () => {
      const result = generate10kSpendWithDummyUtxoSet('tb1qt28eagxcl9gvhq2rpj5slg7dwgxae2dn2hk93m');
      const hasDust = result.filteredUtxos.some(utxo => utxo.value <= BTC_P2WPKH_DUST_AMOUNT);
      expect(hasDust).toBeFalsy();
    });

    test('that it sorts utxos in decending order', () => {
      const result = generate10kSpendWithDummyUtxoSet('tb1qt28eagxcl9gvhq2rpj5slg7dwgxae2dn2hk93m');
      result.inputs.forEach((u, i) => {
        const nextUtxo = result.inputs[i + 1];
        if (!nextUtxo) return;
        expect(u.value >= nextUtxo.value).toEqual(true);
      });
    });
  });

  test('that it accepts a wrapped segwit address', () =>
    expect(() =>
      generate10kSpendWithDummyUtxoSet('33SVjoCHJovrXxjDKLFSXo1h3t5KgkPzfH')
    ).not.toThrowError());

  test('that it accepts a legacy addresses', () =>
    expect(() =>
      generate10kSpendWithDummyUtxoSet('15PyZveQd28E2SHZu2ugkWZBp6iER41vXj')
    ).not.toThrowError());

  test('that it throws an error with non-legit address', () => {
    expect(() =>
      generate10kSpendWithDummyUtxoSet('whoop-de-da-boop-da-de-not-a-bitcoin-address')
    ).toThrowError();
  });

  test('that given a set of utxos, legacy is more expensive', () => {
    const legacy = generate10kSpendWithDummyUtxoSet('15PyZveQd28E2SHZu2ugkWZBp6iER41vXj');
    const segwit = generate10kSpendWithDummyUtxoSet('33SVjoCHJovrXxjDKLFSXo1h3t5KgkPzfH');
    expect(legacy.fee).toBeGreaterThan(segwit.fee);
  });

  test('that given a set of utxos, wrapped segwit is more expensive than native', () => {
    const segwit = generate10kSpendWithDummyUtxoSet('33SVjoCHJovrXxjDKLFSXo1h3t5KgkPzfH');
    const native = generate10kSpendWithDummyUtxoSet('tb1qt28eagxcl9gvhq2rpj5slg7dwgxae2dn2hk93m');
    expect(segwit.fee).toBeGreaterThan(native.fee);
  });

  test('that given a set of utxos, taproot is more expensive than native segwit', () => {
    // Non-obvious behaviour.
    // P2TR outputs = 34 vBytes
    // P2WPKH outputs = 22 vBytes
    const native = generate10kSpendWithDummyUtxoSet('tb1qt28eagxcl9gvhq2rpj5slg7dwgxae2dn2hk93m');
    const taproot = generate10kSpendWithDummyUtxoSet(
      'tb1parwmj7533de3k2fw2kntyqacspvhm67qnjcmpqnnpfvzu05l69nsczdywd'
    );
    expect(taproot.fee).toBeGreaterThan(native.fee);
  });

  test('against a random set of generated utxos', () => {
    const testData = createNullArrayOfLength(50).map(() => ({
      value: Math.ceil(Math.random() * 10000),
    }));
    const amount = 29123n;
    const result = determineUtxosForSpend({
      utxos: testData as any,
      recipients: [
        {
          address: 'tb1qt28eagxcl9gvhq2rpj5slg7dwgxae2dn2hk93m',
          amount: createMoney(Number(amount), 'BTC'),
        },
      ],
      feeRate: 3,
    });
    expect(result.outputs[0].value).toEqual(29123n);

    expect(result.outputs[1].value.toString()).toEqual(
      sumNumbers(result.inputs.map(i => i.value))
        .minus(result.fee)
        .minus(amount.toString())
        .toString()
    );
  });
});
