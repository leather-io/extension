import { test } from '@playwright/test';

import { fetchInscription } from '@app/query/bitcoin/ordinals/inscription.query';
import { getNumberOfInscriptionOnUtxo } from '@app/query/bitcoin/ordinals/ordinals-aware-utxo.query';
import { fetchData } from '@app/query/utils';

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

test.describe('Check Hiro API', () => {
  test('should get same inscription info as in ordapi', async () => {
    const id = '43af4721f64f6db20ab2c0b41d084c5e3733d346925bd613abd6fd64ad2b6645i0';
    const [respHiroApi, respOrdApi] = await Promise.all([
      // fetch inscription from hiro api
      fetchInscription()(id),
      // fetch inscription from ordapi
      fetchData({
        errorMsg: 'Failed to fetch inscription',
        url: `https://ordapi.xyz/inscription/${id}`,
      }),
    ]);
    test.expect(respHiroApi.id).toBe(respOrdApi.id);
    test.expect(respHiroApi.number).toBe(respOrdApi.inscription_number);
  });
});
