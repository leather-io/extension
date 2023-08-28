import { pubKeyToBtcAddress } from '../utils';
import type { MagicFetchElectrumContext } from './constants';
import { fetchBitcoinAddressBalance } from './fetch-bitcoin-address-balance';

/**
 * Fetches the balance of a Bitcoin address by the public key.
 *
 * @param address The Bitcoin address public key.
 * @param context The context.
 */
export async function fetchBitcoinAddressBalanceForPublicKey(
  publicKey: Uint8Array,
  context: MagicFetchElectrumContext
) {
  const address = pubKeyToBtcAddress(publicKey, context.network);
  const balance = fetchBitcoinAddressBalance(address, context);

  return balance;
}
