import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

import { deriveNativeSegWitAccountFromHdKey } from '@shared/crypto/bitcoin/p2wpkh-address-gen';

import { mnemonicToRootNode } from '@app/common/keychain/keychain';
import { createNullArrayOfLength } from '@app/common/utils';
import { selectStacksChain } from '@app/store/chains/stx-chain.selectors';
import { selectInMemoryKey } from '@app/store/in-memory-key/in-memory-key.selectors';

import { selectKeysSlice } from '../key.selectors';
import { defaultKeyId } from '../key.slice';

export const selectSoftwareBitcoinWallet = createSelector(
  selectKeysSlice,
  selectInMemoryKey,
  selectStacksChain,
  (keys, inMemKey, stacksChain) => {
    const defaultKey = keys.entities[defaultKeyId];
    if (!defaultKey || !inMemKey.keys.default) return;
    if (defaultKey.type !== 'software') return;
    const rootNode = mnemonicToRootNode(inMemKey.keys.default);
    return createNullArrayOfLength(stacksChain[defaultKeyId].highestAccountIndex + 1).map(
      (_, index) => deriveNativeSegWitAccountFromHdKey(rootNode)(index).publicExtendedKey
    );
  }
);

export function useSoftwareBitcoinWallet() {
  return useSelector(selectSoftwareBitcoinWallet);
}
