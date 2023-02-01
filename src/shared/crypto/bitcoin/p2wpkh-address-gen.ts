import { HDKey } from '@scure/bip32';
import * as btc from 'micro-btc-signer';

import { NetworkModes } from '@shared/constants';

import { getBtcSignerLibNetworkByMode } from './bitcoin.network';

const coinTypeMap: Record<NetworkModes, 0 | 1> = {
  mainnet: 0,
  testnet: 1,
};

function getBitcoinCoinTypeIndexByNetwork(network: NetworkModes) {
  return coinTypeMap[network];
}

function getNativeSegWitAccountDerivationPath(network: NetworkModes, accountIndex: number) {
  return `m/84'/${getBitcoinCoinTypeIndexByNetwork(network)}'/${accountIndex}'`;
}

export function deriveNativeSegWitAccountFromHdKey(keychain: HDKey, network: NetworkModes) {
  return (index: number) => keychain.derive(getNativeSegWitAccountDerivationPath(network, index));
}

function deriveBip32KeychainFromExtendedPublicKey(xpub: string) {
  return HDKey.fromExtendedKey(xpub);
}

interface DeriveNativeSegWitReceiveAddressIndexFromXpubArgs {
  xpub: string;
  index: number;
  network: NetworkModes;
}
export function deriveNativeSegWitReceiveAddressIndexFromXpub({
  xpub,
  index,
  network,
}: DeriveNativeSegWitReceiveAddressIndexFromXpubArgs) {
  const keychain = deriveBip32KeychainFromExtendedPublicKey(xpub);
  const zeroAddressIndex = keychain.deriveChild(0).deriveChild(index);
  return btc.p2wpkh(zeroAddressIndex.publicKey!, getBtcSignerLibNetworkByMode(network))
    .address as string;
}
