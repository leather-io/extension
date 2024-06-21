import { sumNumbers } from '@leather.io/utils';

import { selectTaprootInscriptionTransferCoins } from './select-inscription-coins';

describe(selectTaprootInscriptionTransferCoins.name, () => {
  test('inscription coin selection', () => {
    const inscriptionInputAmount = 1000n;

    const result = selectTaprootInscriptionTransferCoins({
      recipient: '',
      inscriptionInput: {
        value: Number(inscriptionInputAmount),
        txid: 'txid',
      } as any,
      nativeSegwitUtxos: [
        { value: 1900, vout: 0 },
        { value: 900, vout: 0 },
        { value: 6000, vout: 0 },
        { value: 8900, vout: 0 },
        { value: 3000, vout: 0 },
        { value: 3000, vout: 0 },
        { value: 3000, vout: 0 },
        { value: 300, vout: 0 },
      ] as any[],
      changeAddress: 'changeAddress',
      feeRate: 30,
    });

    if (!result.success) throw new Error('Failed to select coins');

    // First input should map to value of inscription
    expect(result.outputs[0].value).toEqual(inscriptionInputAmount);

    expect(sumNumbers(result.inputs.map(u => u.value)).toNumber()).toEqual(
      sumNumbers(result.outputs.map(u => Number(u.value))).toNumber() +
        result.txFee -
        Number(inscriptionInputAmount)
    );

    expect(result.txFee).toEqual(6608);
  });

  test('when there are not enough utxo to cover fee', () => {
    const result = selectTaprootInscriptionTransferCoins({
      recipient: '',
      inscriptionInput: {
        value: 1000,
        txid: 'txid',
      } as any,
      nativeSegwitUtxos: [
        { value: 0, vout: 0 },
        { value: 1, vout: 0 },
        { value: 2, vout: 0 },
        { value: 3, vout: 0 },
        { value: 4, vout: 0 },
      ] as any[],
      changeAddress: 'changeAddress',
      feeRate: 30,
    });

    expect(result.success).toEqual(false);
  });
});
