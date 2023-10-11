import { HDKey } from '@scure/bip32';
import * as btc from '@scure/btc-signer';

import { BitcoinNetworkModes } from '@shared/constants';

import { DerivationPathDepth } from '../derivation-path.utils';
import { getBtcSignerLibNetworkConfigByMode } from './bitcoin.network';
import {
  BitcoinAccount,
  deriveAddressIndexZeroFromAccount,
  getBitcoinCoinTypeIndexByNetwork,
} from './bitcoin.utils';

export function getNativeSegwitAccountDerivationPath(
  network: BitcoinNetworkModes,
  accountIndex: number
) {
  return `m/84'/${getBitcoinCoinTypeIndexByNetwork(network)}'/${accountIndex}'`;
}

export function getNativeSegwitAddressIndexDerivationPath(
  network: BitcoinNetworkModes,
  accountIndex: number,
  addressIndex: number
) {
  return getNativeSegwitAccountDerivationPath(network, accountIndex) + `/0/${addressIndex}`;
}

export function deriveNativeSegwitAccountFromRootKeychain(
  keychain: HDKey,
  network: BitcoinNetworkModes
) {
  if (keychain.depth !== DerivationPathDepth.Root) throw new Error('Keychain passed is not a root');
  return (accountIndex: number): BitcoinAccount => ({
    type: 'p2wpkh',
    network,
    accountIndex,
    derivationPath: getNativeSegwitAccountDerivationPath(network, accountIndex),
    keychain: keychain.derive(getNativeSegwitAccountDerivationPath(network, accountIndex)),
  });
}

export function getNativeSegWitPaymentFromAddressIndex(
  keychain: HDKey,
  network: BitcoinNetworkModes
) {
  if (keychain.depth !== DerivationPathDepth.AddressIndex)
    throw new Error('Keychain passed is not an address index');

  if (!keychain.publicKey) throw new Error('Keychain does not have a public key');

  return btc.p2wpkh(keychain.publicKey, getBtcSignerLibNetworkConfigByMode(network));
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
  return getNativeSegWitPaymentFromAddressIndex(zeroAddressIndex, network);
}
