import { HDKey } from '@scure/bip32';

import { BitcoinNetworkModes } from '@shared/constants';
import { deriveAddressIndexKeychainFromAccount } from '@shared/crypto/bitcoin/bitcoin.utils';
import { getTaprootPayment } from '@shared/crypto/bitcoin/p2tr-address-gen';
import { DerivationPathDepth } from '@shared/crypto/derivation-path.utils';

export function hasInscriptions(data: unknown[]) {
  return data.length !== 0;
}

interface GetTaprootAddressArgs {
  index: number;
  keychain?: HDKey;
  network: BitcoinNetworkModes;
}
export function getTaprootAddress({ index, keychain, network }: GetTaprootAddressArgs) {
  if (!keychain) throw new Error('Expected keychain to be provided');

  if (keychain.depth !== DerivationPathDepth.Account)
    throw new Error('Expects keychain to be on the account index');

  const addressIndex = deriveAddressIndexKeychainFromAccount(keychain)(index);

  if (!addressIndex.publicKey) {
    throw new Error('Expected publicKey to be defined');
  }

  const payment = getTaprootPayment(addressIndex.publicKey, network);

  if (!payment.address) throw new Error('Expected address to be defined');

  return payment.address;
}
