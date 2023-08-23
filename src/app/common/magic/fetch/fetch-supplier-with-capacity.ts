import { hexToBytes } from 'micro-stacks/common';

import { pubKeyToBtcAddress } from '../utils';
import { fetchBtcBalanceForPublicKey } from './fetch-btc-balance-for-public-key';
import { fetchSupplier } from './fetch-supplier';

import type { MagicFetchContextWithElectrum } from './constants';

export async function fetchSupplierWithCapacity(
  id: number,
  context: MagicFetchContextWithElectrum
) {
  const supplier = await fetchSupplier(id, context);

  const publicKey = hexToBytes(supplier.publicKey);
  const address = pubKeyToBtcAddress(publicKey, context.network);

  const btc = await fetchBtcBalanceForPublicKey(publicKey, context);

  return {
    ...supplier,
    btcAddress: address,
    btc: btc.toString(),
  };
}
