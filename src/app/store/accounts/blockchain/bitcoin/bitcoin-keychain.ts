import { useMemo } from 'react';

import { createSelector } from '@reduxjs/toolkit';
import { HDKey, Versions } from '@scure/bip32';

import { BitcoinNetworkModes } from '@shared/constants';
import { getBtcSignerLibNetworkConfigByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import {
  BitcoinAccount,
  bitcoinNetworkModeToCoreNetworkMode,
  getHdKeyVersionsFromNetwork,
} from '@shared/crypto/bitcoin/bitcoin.utils';

import { useWalletType } from '@app/common/use-wallet-type';
import { selectRootKeychain } from '@app/store/in-memory-key/in-memory-key.selectors';
import { selectCurrentKey } from '@app/store/keys/key.selectors';
import { selectDefaultWalletBitcoinKeyEntities } from '@app/store/ledger/bitcoin-key.slice';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

// This factory selector extends from the wallet root keychain to derive child
// keychains. It accepts a curried fn that takes a keychain and returns a fn
// accepting an account index, to further derive a nested layer of derivation.
// This approach allow us to reuse code between both native segwit and taproot
// keychains.
export function bitcoinAccountBuilderFactory(
  softwareKeychainDerivationFn: (
    key: HDKey,
    network: BitcoinNetworkModes
  ) => (accountIndex: number) => BitcoinAccount,
  ledgerKeychainLookupFn: (
    keyMap: Record<string, { policy: string } | undefined>,
    network: BitcoinNetworkModes
  ) => (accountIndex: number) => BitcoinAccount | undefined
) {
  return createSelector(
    selectCurrentKey,
    selectRootKeychain,
    selectDefaultWalletBitcoinKeyEntities,
    (currentKey, rootKeychain, bitcoinLedgerKeys) => {
      // Mocking types so it's always an object of fns
      if (currentKey?.type === 'ledger') {
        return {
          mainnet: ledgerKeychainLookupFn(bitcoinLedgerKeys, 'mainnet'),
          testnet: ledgerKeychainLookupFn(bitcoinLedgerKeys, 'testnet'),
          signet: ledgerKeychainLookupFn(bitcoinLedgerKeys, 'signet'),
          regtest: ledgerKeychainLookupFn(bitcoinLedgerKeys, 'regtest'),
        };
      }
      if (!rootKeychain) throw new Error('No in-memory key found');
      return {
        mainnet: softwareKeychainDerivationFn(rootKeychain, 'mainnet'),
        testnet: softwareKeychainDerivationFn(rootKeychain, 'testnet'),
        signet: softwareKeychainDerivationFn(rootKeychain, 'signet'),
        regtest: softwareKeychainDerivationFn(rootKeychain, 'regtest'),
      };
    }
  );
}

export function useBitcoinScureLibNetworkConfig() {
  const network = useCurrentNetwork();
  return getBtcSignerLibNetworkConfigByMode(network.chain.bitcoin.network);
}

export function useBitcoinExtendedPublicKeyVersions(): Versions | undefined {
  const network = useCurrentNetwork();
  const { whenWallet } = useWalletType();
  // Only Ledger in testnet mode do we need to manually declare `Versions`
  return useMemo(
    () =>
      whenWallet({
        software: undefined,
        ledger: getHdKeyVersionsFromNetwork(
          bitcoinNetworkModeToCoreNetworkMode(network.chain.bitcoin.network)
        ),
      }),
    [network, whenWallet]
  );
}
