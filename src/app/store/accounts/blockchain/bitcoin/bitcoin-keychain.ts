import { createSelector } from '@reduxjs/toolkit';
import { HDKey } from '@scure/bip32';
import * as btc from '@scure/btc-signer';

import { BitcoinNetworkModes, NetworkModes } from '@shared/constants';
import { getBtcSignerLibNetworkConfigByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import { deriveAddressIndexZeroFromAccount } from '@shared/crypto/bitcoin/bitcoin.utils';
import { deriveTaprootAccountFromRootKeychain } from '@shared/crypto/bitcoin/p2tr-address-gen';
import {
  deriveNativeSegWitAccountKeychain,
  getNativeSegWitPaymentFromKeychain,
} from '@shared/crypto/bitcoin/p2wpkh-address-gen';

import { mnemonicToRootNode } from '@app/common/keychain/keychain';
import { selectInMemoryKey } from '@app/store/in-memory-key/in-memory-key.selectors';
import { selectCurrentKey } from '@app/store/keys/key.selectors';
import { defaultKeyId } from '@app/store/keys/key.slice';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

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
    return getNativeSegWitPaymentFromKeychain(
      deriveAddressIndexZeroFromAccount(account),
      'mainnet'
    );
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

export function useBitcoinScureLibNetworkConfig() {
  const network = useCurrentNetwork();
  return getBtcSignerLibNetworkConfigByMode(network.chain.bitcoin.network);
}

export function useBitcoinJsLibNetworkConfig() {
  const network = useCurrentNetwork();
  return getBtcSignerLibNetworkConfigByMode(network.chain.bitcoin.network);
}

interface BitcoinSignerFactoryArgs {
  addressIndexKeychainFn(addressIndex: number): HDKey;
  paymentFn(keychain: HDKey, network: BitcoinNetworkModes): unknown;
  network: BitcoinNetworkModes;
}
export function bitcoinSignerFactory<T extends BitcoinSignerFactoryArgs>(args: T) {
  const { network, paymentFn, addressIndexKeychainFn } = args;
  return (addressIndex: number) => {
    const addressIndexKeychain = addressIndexKeychainFn(addressIndex);
    return {
      payment: paymentFn(addressIndexKeychain, network) as ReturnType<T['paymentFn']>,
      sign(tx: btc.Transaction) {
        if (!addressIndexKeychain.privateKey)
          throw new Error('Unable to sign taproot transaction, no private key found');

        tx.sign(addressIndexKeychain.privateKey);
      },
      signIndex(tx: btc.Transaction, index: number, allowedSighash?: btc.SignatureHash[]) {
        if (!addressIndexKeychain.privateKey)
          throw new Error('Unable to sign taproot transaction, no private key found');

        tx.signIdx(addressIndexKeychain.privateKey, index, allowedSighash);
      },
    };
  };
}
