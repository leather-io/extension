import { filterUtxosWithInscriptions, filterUtxosWithRunes } from '@leather-wallet/query';
import { mockInscriptionsList } from '@tests/mocks/mock-inscriptions';
import { mockRunesOutputsByAddressList } from '@tests/mocks/mock-runes';
import { mockUtxos, mockUtxosListWithRunes } from '@tests/mocks/mock-utxos';

describe(filterUtxosWithInscriptions, () => {
  test('that it filters out utxos with inscriptions so they are not spent', () => {
    const filteredUtxos = filterUtxosWithInscriptions(mockInscriptionsList, mockUtxos);
    expect(filteredUtxos).toEqual([]);
  });
});

describe(filterUtxosWithRunes, () => {
  test('that it filters out utxos with runes so they are not spent', () => {
    const filteredUtxos = filterUtxosWithRunes(
      mockRunesOutputsByAddressList,
      mockUtxosListWithRunes
    );

    expect(filteredUtxos).toEqual([
      {
        txid: '66ff7d54e345170e3a76819dc90140971fdae054c9b7eea2089ba5a9720f6e44',
        vout: 1,
        status: {
          confirmed: true,
          block_height: 2585955,
          block_hash: '00000000000000181cae54c3c19d6ed02511a2f6302a666c3d78bcf1777bb029',
          block_time: 1712829917,
        },
        value: 546,
      },
    ]);
  });
});
