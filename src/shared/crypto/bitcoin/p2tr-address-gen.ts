import { HDKey } from '@scure/bip32';
import * as btc from '@scure/btc-signer';

import { BitcoinNetworkModes } from '@shared/constants';

import { DerivationPathDepth } from '../derivation-path.utils';
import { getBtcSignerLibNetworkConfigByMode } from './bitcoin.network';
import {
  BitcoinAccount,
  ecdsaPublicKeyToSchnorr,
  getBitcoinCoinTypeIndexByNetwork,
} from './bitcoin.utils';

export function getTaprootAccountDerivationPath(
  network: BitcoinNetworkModes,
  accountIndex: number
) {
  return `m/86'/${getBitcoinCoinTypeIndexByNetwork(network)}'/${accountIndex}'`;
}

export function getTaprootAddressIndexDerivationPath(
  network: BitcoinNetworkModes,
  accountIndex: number,
  addressIndex: number
) {
  return getTaprootAccountDerivationPath(network, accountIndex) + `/0/${addressIndex}`;
}

export function deriveTaprootAccount(keychain: HDKey, network: BitcoinNetworkModes) {
  if (keychain.depth !== DerivationPathDepth.Root)
    throw new Error('Keychain passed is not an account');

  return (accountIndex: number): BitcoinAccount => ({
    type: 'p2tr',
    network,
    accountIndex,
    derivationPath: getTaprootAccountDerivationPath(network, accountIndex),
    keychain: keychain.derive(getTaprootAccountDerivationPath(network, accountIndex)),
  });
}

export function getTaprootPayment(publicKey: Uint8Array, network: BitcoinNetworkModes) {
  return btc.p2tr(
    ecdsaPublicKeyToSchnorr(publicKey),
    undefined,
    getBtcSignerLibNetworkConfigByMode(network)
  );
}

export function getTaprootPaymentFromAddressIndex(keychain: HDKey, network: BitcoinNetworkModes) {
  if (keychain.depth !== DerivationPathDepth.AddressIndex)
    throw new Error('Keychain passed is not an address index');

  if (!keychain.publicKey) throw new Error('Keychain has no public key');

  return getTaprootPayment(keychain.publicKey, network);
}
