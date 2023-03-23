import { HDKey } from '@scure/bip32';
import * as btc from '@scure/btc-signer';

import { NetworkModes } from '@shared/constants';

import { DerivationPathDepth } from '../derivation-path.utils';
import { getBtcSignerLibNetworkByMode } from './bitcoin.network';
import {
  deriveAddressIndexKeychainFromAccount,
  ecdsaPublicKeyToSchnorr,
  getBitcoinCoinTypeIndexByNetwork,
} from './bitcoin.utils';

function getTaprootAccountDerivationPath(network: NetworkModes, accountIndex: number) {
  return `m/86'/${getBitcoinCoinTypeIndexByNetwork(network)}'/${accountIndex}'`;
}

export function deriveTaprootAccountFromRootKeychain(keychain: HDKey, network: NetworkModes) {
  if (keychain.depth !== DerivationPathDepth.Root)
    throw new Error('Keychain passed is not an account');

  return (index: number) => keychain.derive(getTaprootAccountDerivationPath(network, index));
}

export function getTaprootPayment(publicKey: Uint8Array, network: NetworkModes) {
  return btc.p2tr(
    ecdsaPublicKeyToSchnorr(publicKey),
    undefined,
    getBtcSignerLibNetworkByMode(network)
  );
}

export function getTaprootPaymentFromAddressIndex(keychain: HDKey, network: NetworkModes) {
  if (keychain.depth !== DerivationPathDepth.AddressIndex)
    throw new Error('Keychain passed is not an address index');

  if (!keychain.publicKey) throw new Error('Keychain has no public key');

  return getTaprootPayment(keychain.publicKey, network);
}

interface DeriveTaprootReceiveAddressIndexArgs {
  xpub: string;
  index: number;
  network: NetworkModes;
}
export function deriveTaprootReceiveAddressIndex({
  xpub,
  index,
  network,
}: DeriveTaprootReceiveAddressIndexArgs) {
  if (!xpub) return;
  const keychain = HDKey.fromExtendedKey(xpub);
  const addressIndexKeychain = deriveAddressIndexKeychainFromAccount(keychain)(index);
  return getTaprootPayment(addressIndexKeychain.publicKey!, network);
}
