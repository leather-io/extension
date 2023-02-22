import { createSelector } from '@reduxjs/toolkit';
import { HDKey } from '@scure/bip32';

import { NetworkModes } from '@shared/constants';
import { deriveTaprootAccountFromRootKeychain } from '@shared/crypto/bitcoin/p2tr-address-gen';
import {
  deriveNativeSegWitAccountKeychain,
  getNativeSegWitAddressIndex,
} from '@shared/crypto/bitcoin/p2wpkh-address-gen';

import { mnemonicToRootNode } from '@app/common/keychain/keychain';
import { selectInMemoryKey } from '@app/store/in-memory-key/in-memory-key.selectors';
import { selectCurrentKey } from '@app/store/keys/key.selectors';
import { defaultKeyId } from '@app/store/keys/key.slice';

// This factory selector extends from the wallet root keychain to derive child
// keychains. It accepts a curried fn that takes a keychain and returns a fn
// accepting an account index, to further derive a nested layer of derivation.
// We use this approach to reuse code between both native segwit and taproot
// keychains.
function bitcoinKeychainSelectorFactory(
  keychainFn: (hdkey: HDKey, network: NetworkModes) => (index: number) => HDKey,
  network: NetworkModes
) {
  return createSelector(selectCurrentKey, selectInMemoryKey, (currentKey, inMemKey) => {
    if (currentKey?.type !== 'software') return;

    if (!inMemKey.keys[defaultKeyId]) throw new Error('No in-memory key found');

    return keychainFn(mnemonicToRootNode(inMemKey.keys.default), network);
  });
}

export function getNativeSegwitMainnetAddressFromMnemonic(secretKey: string) {
  return (accountIndex: number) => {
    const rootNode = mnemonicToRootNode(secretKey);
    const account = deriveNativeSegWitAccountKeychain(rootNode, 'mainnet')(accountIndex);
    return getNativeSegWitAddressIndex(account, 'mainnet');
  };
}

export const selectMainnetNativeSegWitKeychain = bitcoinKeychainSelectorFactory(
  deriveNativeSegWitAccountKeychain,
  'mainnet'
);

export const selectTestnetNativeSegWitKeychain = bitcoinKeychainSelectorFactory(
  deriveNativeSegWitAccountKeychain,
  'testnet'
);

export const selectMainnetTaprootKeychain = bitcoinKeychainSelectorFactory(
  deriveTaprootAccountFromRootKeychain,
  'mainnet'
);

export const selectTestnetTaprootKeychain = bitcoinKeychainSelectorFactory(
  deriveTaprootAccountFromRootKeychain,
  'testnet'
);
