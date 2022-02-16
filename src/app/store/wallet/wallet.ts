import { atom } from 'jotai';
import { Wallet, Account } from '@stacks/wallet-sdk';

import { textToBytes } from '@app/common/store-utils';
import { storeAtom } from '..';
import { deriveWalletWithAccounts } from '../chains/stx-chain.selectors';
import { defaultKeyId } from '../keys/key.slice';
import { accountsWithAddressState } from '../accounts';

export const softwareWalletState = atom(async get => {
  const store = get(storeAtom);
  const defaultKey = store.keys.entities[defaultKeyId];
  const defaultInMemoryKey = store.inMemoryKeys.keys[defaultKeyId];
  if (!defaultInMemoryKey || !defaultKey) return;
  if (defaultKey.type !== 'software') return;
  return deriveWalletWithAccounts(defaultInMemoryKey, store.chains.stx.default.highestAccountIndex);
});

//
// `Wallet` is an unfortunate high-level abstraction used in `@stacks/wallet-sdk`.
// This interface includes impossible information for hw wallets, such as the private
// key. In many places throughout the wallet code, and the wallet-sdk library,
// methods expect `Wallet`, e.g. `updateWalletConfigWithApp`, despite the fact
// that only a single property of `Wallet`, such as accounts `Account[]`, is
// used.
//
// This situation draws parallels to a common argument against OO style programming
//    > You wanted a banana but you got a gorilla holding the banana
// Translated:
//    > We want the accounts, but we got a wallet with the accounts in it
//
// Now, we only have `Account[]`, and struggle to reuse code because methods
// require information we don't have
//
// Here, we mock the `Wallet` type for hardware wallets. Setting all the crypto
// values to an empty string, and only including the properties we do have
// access to.
// ts-unused-exports:disable-next-line
export const ledgerWalletState = atom(get => {
  const store = get(storeAtom);
  const accounts = get(accountsWithAddressState);
  const defaultKey = store.keys.entities[defaultKeyId];

  if (!defaultKey) return;
  if (defaultKey.type !== 'ledger') return;

  const wallet: Wallet = {
    salt: '',
    rootKey: '',
    configPrivateKey: '',
    encryptedSecretKey: '',
    accounts: accounts as Account[],
  };
  return wallet;
});

export const walletState = atom(get => {
  const softwareWallet = get(softwareWalletState);
  const ledgerWallet = get(ledgerWalletState);
  return softwareWallet ? softwareWallet : ledgerWallet;
});

export const ledgerKeyState = atom(async get => {
  const store = get(storeAtom);
  if (!store.keys.entities.default) return;
  if (store.keys.entities.default.type !== 'ledger') return;
  return store.keys.entities.default;
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
