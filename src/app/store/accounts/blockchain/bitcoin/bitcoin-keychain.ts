import { createSelector } from '@reduxjs/toolkit';
import { HDKey } from '@scure/bip32';

import { NetworkModes } from '@shared/constants';
import { getBtcSignerLibNetworkConfigByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import { BitcoinAccount } from '@shared/crypto/bitcoin/bitcoin.utils';

import { selectRootKeychain } from '@app/store/in-memory-key/in-memory-key.selectors';
import { selectCurrentKey } from '@app/store/keys/key.selectors';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

// This factory selector extends from the wallet root keychain to derive child
// keychains. It accepts a curried fn that takes a keychain and returns a fn
// accepting an account index, to further derive a nested layer of derivation.
// This approach allow us to reuse code between both native segwit and taproot
// keychains.
export function bitcoinKeychainSelectorFactory(
  keychainFn: (hdkey: HDKey, network: NetworkModes) => (accountIndex: number) => BitcoinAccount,
  network: NetworkModes
) {
  return createSelector(selectCurrentKey, selectRootKeychain, (currentKey, rootKeychain) => {
    if (currentKey?.type !== 'software') return;
    if (!rootKeychain) throw new Error('No in-memory key found');
    return keychainFn(rootKeychain, network);
  });
}

export function useBitcoinScureLibNetworkConfig() {
  const network = useCurrentNetwork();
  return getBtcSignerLibNetworkConfigByMode(network.chain.bitcoin.network);
}
