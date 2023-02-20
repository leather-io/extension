import { HDKey } from '@scure/bip32';

import { NetworkModes } from '@shared/constants';

import { DerivationPathDepth } from '../derivation-path.utils';

const coinTypeMap: Record<NetworkModes, 0 | 1> = {
  mainnet: 0,
  testnet: 1,
};

export function getBitcoinCoinTypeIndexByNetwork(network: NetworkModes) {
  return coinTypeMap[network];
}

export function deriveAddressIndexKeychainFromAccount(keychain: HDKey) {
  if (keychain.depth !== DerivationPathDepth.Account)
    throw new Error('Keychain passed is not an account');

  return (index: number) => keychain.deriveChild(0).deriveChild(index);
}

export function deriveAddressIndexZeroFromAccount(keychain: HDKey) {
  return deriveAddressIndexKeychainFromAccount(keychain)(0);
}
