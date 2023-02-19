import { HDKey } from '@scure/bip32';
import * as btc from 'micro-btc-signer';

import { NetworkModes } from '@shared/constants';

import { DerivationPathDepth } from '../derivation-path.utils';
import { getBtcSignerLibNetworkByMode } from './bitcoin.network';
import { getBitcoinCoinTypeIndexByNetwork } from './bitcoin.utils';

function getNativeSegWitAccountDerivationPath(network: NetworkModes, accountIndex: number) {
  return `m/84'/${getBitcoinCoinTypeIndexByNetwork(network)}'/${accountIndex}'`;
}

export function deriveNativeSegWitAccountFromHdKey(keychain: HDKey, network: NetworkModes) {
  return (index: number) => keychain.derive(getNativeSegWitAccountDerivationPath(network, index));
}

export function deriveBip32KeychainFromExtendedPublicKey(xpub: string) {
  return HDKey.fromExtendedKey(xpub);
}

export function deriveIndexZeroKeychainFromAccount(keychain: HDKey) {
  if (keychain.depth !== DerivationPathDepth.Account)
    throw new Error('Keychain passed is not an account');

  return keychain.deriveChild(0).deriveChild(0);
}

export function getNativeSegWitAddressIndexZero(keychain: HDKey, network: NetworkModes) {
  if (keychain.depth !== DerivationPathDepth.AddressIndex)
    throw new Error('Keychain passed is not an address index');

  return btc.p2wpkh(keychain.publicKey!, getBtcSignerLibNetworkByMode(network));
}

interface DeriveNativeSegWitReceiveAddressIndexArgs {
  xpub: string;
  network: NetworkModes;
}
export function deriveNativeSegWitReceiveAddressIndex({
  xpub,
  network,
}: DeriveNativeSegWitReceiveAddressIndexArgs) {
  if (!xpub) return;
  const keychain = deriveBip32KeychainFromExtendedPublicKey(xpub);
  if (!keychain) return;
  const zeroAddressIndex = deriveIndexZeroKeychainFromAccount(keychain);
  return getNativeSegWitAddressIndexZero(zeroAddressIndex, network);
}
