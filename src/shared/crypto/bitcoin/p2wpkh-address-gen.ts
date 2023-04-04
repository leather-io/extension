import { HDKey } from '@scure/bip32';
import * as btc from '@scure/btc-signer';

import { BitcoinNetworkModes, NetworkModes } from '@shared/constants';

import { DerivationPathDepth } from '../derivation-path.utils';
import { getBtcSignerLibNetworkConfigByMode } from './bitcoin.network';
import {
  deriveAddressIndexZeroFromAccount,
  getBitcoinCoinTypeIndexByNetwork,
} from './bitcoin.utils';

function getNativeSegWitAccountDerivationPath(network: NetworkModes, accountIndex: number) {
  return `m/84'/${getBitcoinCoinTypeIndexByNetwork(network)}'/${accountIndex}'`;
}

export function deriveNativeSegWitAccountKeychain(keychain: HDKey, network: NetworkModes) {
  if (keychain.depth !== DerivationPathDepth.Root) throw new Error('Keychain passed is not a root');
  return (index: number) => keychain.derive(getNativeSegWitAccountDerivationPath(network, index));
}

export function getNativeSegWitAddressIndexFromKeychain(
  keychain: HDKey,
  network: BitcoinNetworkModes
) {
  if (keychain.depth !== DerivationPathDepth.AddressIndex)
    throw new Error('Keychain passed is not an address index');

  return btc.p2wpkh(keychain.publicKey!, getBtcSignerLibNetworkConfigByMode(network));
}

interface DeriveNativeSegWitReceiveAddressIndexArgs {
  xpub: string;
  network: BitcoinNetworkModes;
}
export function deriveNativeSegWitReceiveAddressIndex({
  xpub,
  network,
}: DeriveNativeSegWitReceiveAddressIndexArgs) {
  if (!xpub) return;
  const keychain = HDKey.fromExtendedKey(xpub);
  if (!keychain) return;
  const zeroAddressIndex = deriveAddressIndexZeroFromAccount(keychain);
  return getNativeSegWitAddressIndexFromKeychain(zeroAddressIndex, network);
}
