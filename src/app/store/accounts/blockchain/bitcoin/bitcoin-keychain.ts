import { createSelector } from '@reduxjs/toolkit';
import { HDKey } from '@scure/bip32';

import { NetworkModes } from '@shared/constants';
import { getBtcSignerLibNetworkConfigByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import { BitcoinAccount } from '@shared/crypto/bitcoin/bitcoin.utils';

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
    network: NetworkModes
  ) => (accountIndex: number) => BitcoinAccount,
  ledgerKeychainLookupFn: (
    keyMap: Record<string, { policy: string } | undefined>,
    network: NetworkModes
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
        };
      }
      if (!rootKeychain) throw new Error('No in-memory key found');
      return {
        mainnet: softwareKeychainDerivationFn(rootKeychain, 'mainnet'),
        testnet: softwareKeychainDerivationFn(rootKeychain, 'testnet'),
      };
    }
  );
}

export function useBitcoinScureLibNetworkConfig() {
  const network = useCurrentNetwork();
  return getBtcSignerLibNetworkConfigByMode(network.chain.bitcoin.network);
}
