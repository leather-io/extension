import * as secp from '@noble/secp256k1';
import { HDKey } from '@scure/bip32';
import * as btc from 'micro-btc-signer';

import { NetworkModes } from '@shared/constants';

import { DerivationPathDepth } from '../derivation-path.utils';
import { getBtcSignerLibNetworkByMode } from './bitcoin.network';
import {
  deriveAddressIndexKeychainFromAccount,
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

export function getTaprootAddressIndexFromAccount(keychain: HDKey, network: NetworkModes) {
  if (keychain.depth !== DerivationPathDepth.AddressIndex)
    throw new Error('Keychain passed is not an address index');

  return btc.p2tr(
    secp.schnorr.getPublicKey(keychain?.privateKey!),
    undefined,
    getBtcSignerLibNetworkByMode(network)
  );
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
  const zeroAddressIndex = deriveAddressIndexKeychainFromAccount(keychain)(index);
  return btc.p2tr(
    secp.schnorr.getPublicKey(zeroAddressIndex?.privateKey!),
    undefined,
    getBtcSignerLibNetworkByMode(network)
  );
}
