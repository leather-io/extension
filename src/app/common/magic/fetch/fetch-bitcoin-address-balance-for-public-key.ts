import { pubKeyToBtcAddress } from '../utils';
import type { MagicFetchContextWithBitcoin } from './constants';

/**
 * Fetches the total balance of a Bitcoin address by the public key.
 *
 * @param address The Bitcoin address public key.
 * @param context The context.
 */
export async function fetchBitcoinAddressBalanceForPublicKey(
  publicKey: Uint8Array,
  { network, bitcoinClient}: MagicFetchContextWithBitcoin
) {
  const address = pubKeyToBtcAddress(publicKey, network);
  const addressDetails = await bitcoinClient.addressApi.getAddressDetails(address);

  const confirmedBalance = addressDetails.chain_stats.funded_txo_sum - addressDetails.chain_stats.spent_txo_sum;
  const unconfirmedBalance = addressDetails.mempool_stats.funded_txo_sum - addressDetails.mempool_stats.spent_txo_sum;

  const totalBalance = (confirmedBalance + unconfirmedBalance);

  return totalBalance;
}
