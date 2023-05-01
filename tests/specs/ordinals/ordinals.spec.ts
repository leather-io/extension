import { test } from '@playwright/test';

import { getNumberOfInscriptionOnUtxo } from '@app/query/bitcoin/ordinals/ordinals-aware-utxo.query';

test.describe(getNumberOfInscriptionOnUtxo.name, () => {
  test('should return 3 in case of 3 inscriptions', async () => {
    const resp = await getNumberOfInscriptionOnUtxo(
      'aa24aecb0e60afa43b646c5a61fee76aebdbbf85b8f85a4aa429f9d0c52c9623',
      0
    );
    test.expect(resp).toBe(3);
  });

  test('should return 0 in case of this random address', async () => {
    const resp = await getNumberOfInscriptionOnUtxo(
      '75d11f43163ca0c3a1656e124a63bc08da267c0f8454aa5244ef7346839dc5d5',
      0
    );
    test.expect(resp).toBe(0);
  });
});
