import { atom } from 'jotai';
import { textToBytes } from '@app/common/store-utils';
import { storeAtom } from '..';
import { deriveWalletWithAccounts } from '../chains/stx-chain.selectors';
import { defaultKeyId } from '../keys/key.slice';

export const walletState = atom(async get => {
  const store = get(storeAtom);
  if (!store.keys.entities[defaultKeyId]) return;
  const defaultInMemoryKey = store.inMemoryKeys.keys[defaultKeyId];
  if (!defaultInMemoryKey) return;
  return deriveWalletWithAccounts(defaultInMemoryKey, store.chains.stx.default.highestAccountIndex);
});

export const encryptedSecretKeyState = atom(get => {
  const store = get(storeAtom);
  return store.keys.entities[defaultKeyId]?.encryptedSecretKey;
});

export const currentAccountIndexState = atom(get => {
  const store = get(storeAtom);
  return store.chains.stx[defaultKeyId].currentAccountIndex;
});

export const secretKeyState = atom(get => {
  const store = get(storeAtom);
  return store.inMemoryKeys.keys.default ? textToBytes(store.inMemoryKeys.keys.default) : undefined;
});
