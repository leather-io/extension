import { createSelector } from '@reduxjs/toolkit';

import { deriveNativeSegWitAccountFromHdKey } from '@shared/crypto/bitcoin/p2wpkh-address-gen';

import { mnemonicToRootNode } from '@app/common/keychain/keychain';
import { selectInMemoryKey } from '@app/store/in-memory-key/in-memory-key.selectors';
import { selectCurrentKey } from '@app/store/keys/key.selectors';
import { defaultKeyId } from '@app/store/keys/key.slice';
import { selectCurrentNetwork } from '@app/store/networks/networks.selectors';

export const selectSoftwareBitcoinNativeSegWitKeychain = createSelector(
  selectCurrentKey,
  selectInMemoryKey,
  selectCurrentNetwork,
  (currentKey, inMemKey, network) => {
    if (currentKey?.type !== 'software') return;
    if (!inMemKey.keys[defaultKeyId]) throw new Error('No in-memory key found');
    return deriveNativeSegWitAccountFromHdKey(
      mnemonicToRootNode(inMemKey.keys.default),
      network.chain.bitcoin.network
    );
  }
);
