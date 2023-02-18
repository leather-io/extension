import { HDKey } from '@scure/bip32';
import * as btc from 'micro-btc-signer';

import { NetworkModes } from '@shared/constants';

import { getBtcSignerLibNetworkByMode } from './bitcoin.network';
import { getBitcoinCoinTypeIndexByNetwork } from './bitcoin.utils';

function getNativeSegWitAccountDerivationPath(network: NetworkModes, accountIndex: number) {
  return `m/84'/${getBitcoinCoinTypeIndexByNetwork(network)}'/${accountIndex}'`;
}

export function deriveNativeSegWitAccountFromHdKey(keychain: HDKey, network: NetworkModes) {
  return (index: number) => keychain.derive(getNativeSegWitAccountDerivationPath(network, index));
}

export function deriveBip32KeychainFromExtendedPublicKey(xpub: string) {
  if (!xpub) return;
  return HDKey.fromExtendedKey(xpub);
}

interface DeriveNativeSegWitReceiveAddressIndexArgs {
  xpub: string;
  index: number;
  network: NetworkModes;
}
export function deriveNativeSegWitReceiveAddressIndex({
  xpub,
  index,
  network,
}: DeriveNativeSegWitReceiveAddressIndexArgs) {
  if (!xpub) return;
  const keychain = deriveBip32KeychainFromExtendedPublicKey(xpub);
  const zeroAddressIndex = keychain?.deriveChild(0).deriveChild(index);
  return btc.p2wpkh(zeroAddressIndex?.publicKey!, getBtcSignerLibNetworkByMode(network));
}
