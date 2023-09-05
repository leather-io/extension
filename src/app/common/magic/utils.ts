import BigNumber from 'bignumber.js';
import { base58checkEncode, hashRipemd160 } from 'micro-stacks/crypto';
import { hashSha256 } from 'micro-stacks/crypto-sha';

import { DefaultNetworkConfigurations } from '@shared/constants';

import { getBitcoinNetwork } from './network';

export function pubKeyToBtcAddress(publicKey: Uint8Array, network: DefaultNetworkConfigurations) {
  const sha256 = hashSha256(publicKey);
  const hash160 = hashRipemd160(sha256);

  return base58checkEncode(hash160, getBitcoinNetwork(network).pubKeyHash);
}

export function convertBtcToSats(btc: number) {
  return BigInt(new BigNumber(btc).shiftedBy(8).decimalPlaces(0).toString());
}
