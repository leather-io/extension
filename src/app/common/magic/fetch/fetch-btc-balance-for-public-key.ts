import { pubKeyToBtcAddress } from '../utils';
import { fetchBtcBalance } from './fetch-btc-balance';

import type { MagicFetchElectrumContext } from './constants';

export async function fetchBtcBalanceForPublicKey(
  publicKey: Uint8Array,
  context: MagicFetchElectrumContext
) {
  const address = pubKeyToBtcAddress(publicKey, context.network);
  const balance = fetchBtcBalance(address, context);

  return balance;
}
