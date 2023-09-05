import { ripemd160 } from '@noble/hashes/ripemd160';
import { sha256 } from '@noble/hashes/sha256';
import BigNumber from 'bignumber.js';
import { toBase58Check } from 'bitcoinjs-lib/src/address';

import { DefaultNetworkConfigurations } from '@shared/constants';

import { getBitcoinNetwork } from './network';

export function pubKeyToBtcAddress(publicKey: Uint8Array, network: DefaultNetworkConfigurations) {
  const publicKeySha256 = sha256(publicKey);
  const publicKeyRipemd160 = ripemd160(publicKeySha256);

  return toBase58Check(Buffer.from(publicKeyRipemd160), getBitcoinNetwork(network).pubKeyHash);
}

export function convertBtcToSats(btc: number) {
  return BigInt(new BigNumber(btc).shiftedBy(8).decimalPlaces(0).toString());
}
