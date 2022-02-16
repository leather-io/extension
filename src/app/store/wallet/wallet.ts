import { atom } from 'jotai';
import { fetchWalletConfig, createWalletGaiaConfig } from '@stacks/wallet-sdk';
import { gaiaUrl } from '@shared/constants';
import { textToBytes } from '@app/common/store-utils';
import { storeAtom } from '..';
import { deriveWalletWithAccounts } from '../chains/stx-chain.selectors';
import { defaultKeyId } from '../keys/key.slice';

export const softwareWalletState = atom(async get => {
  const store = get(storeAtom);
  if (!store.keys.entities[defaultKeyId]) return;
  const defaultInMemoryKey = store.inMemoryKeys.keys[defaultKeyId];
  if (store.keys.entities.default.type !== 'software') return;
  if (!defaultInMemoryKey) return;
  return deriveWalletWithAccounts(defaultInMemoryKey, store.chains.stx.default.highestAccountIndex);
});

export const ledgerWalletState = atom(async get => {
  const store = get(storeAtom);
  if (!store.keys.entities.default) return;
  if (store.keys.entities.default.type !== 'ledger') return;
  return store.keys.entities.default;
});

export const walletConfigState = atom(async get => {
  const wallet = get(softwareWalletState);
  if (!wallet) return null;
  const gaiaHubConfig = await createWalletGaiaConfig({ wallet, gaiaHubUrl: gaiaUrl });
  return fetchWalletConfig({ wallet, gaiaHubConfig });
});

export const encryptedSecretKeyState = atom(get => {
  const store = get(storeAtom);
  const defaultKey = store.keys.entities[defaultKeyId];
  if (!defaultKey || defaultKey.type !== 'software') return;
  return defaultKey.encryptedSecretKey;
});

export const currentAccountIndexState = atom(get => {
  const store = get(storeAtom);
  return store.chains.stx[defaultKeyId].currentAccountIndex;
});

export const secretKeyState = atom(get => {
  const store = get(storeAtom);
  return store.inMemoryKeys.keys.default ? textToBytes(store.inMemoryKeys.keys.default) : undefined;
});
