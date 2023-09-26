import { mockInscriptionsList } from '@tests/mocks/mock-inscriptions';

import { findInscriptionsOnUtxo } from './inscriptions.hooks';

describe(findInscriptionsOnUtxo, () => {
  test('that it finds an inscription on a utxo', () => {
    const foundInscriptions = findInscriptionsOnUtxo({
      index: 0,
      inscriptions: mockInscriptionsList,
      txId: '58d44000884f0ba4cdcbeb1ac082e6c802d300c16b0d3251738e8cf6a57397ce',
    });
    expect(foundInscriptions.length).toEqual(1);
  });
});
