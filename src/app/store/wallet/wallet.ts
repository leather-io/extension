import { createSelector } from '@reduxjs/toolkit';
import { Account, Wallet } from '@stacks/wallet-sdk';
import { atom } from 'jotai';

import { analytics } from '@shared/utils/analytics';

import { textToBytes } from '@app/common/store-utils';

import { storeAtom } from '..';
import { accountsWithAddressState } from '../accounts/accounts';
import { deriveWalletWithAccounts, selectStacksChain } from '../chains/stx-chain.selectors';
import { selectInMemoryKey } from '../in-memory-key/in-memory-key.selectors';
import { selectKeysSlice } from '../keys/key.selectors';
import { defaultKeyId } from '../keys/key.slice';

export const selectEncryptedSecretKey = createSelector(selectKeysSlice, state => {
  const defaultKey = state.entities[defaultKeyId];
  if (!defaultKey || defaultKey.type !== 'software') return;
  return defaultKey.encryptedSecretKey;
});

export const selectCurrentAccountIndex = createSelector(selectStacksChain, state => {
  return state[defaultKeyId].currentAccountIndex;
});

export const selectSecretKey = createSelector(selectInMemoryKey, inMemKeys => {
  return inMemKeys.keys.default ? textToBytes(inMemKeys.keys.default) : undefined;
});

export const selectLedgerKey = createSelector(selectKeysSlice, keys => {
  if (!keys.entities.default) return;
  if (keys.entities.default.type !== 'ledger') return;
  return keys.entities.default;
});

export const softwareStacksWalletState = atom(async get => {
  const store = get(storeAtom);
  const defaultKey = store.keys.entities[defaultKeyId];
  const defaultInMemoryKey = store.inMemoryKeys.keys[defaultKeyId];
  if (!defaultInMemoryKey || !defaultKey) return;
  if (defaultKey.type !== 'software') return;
  const { highestAccountIndex, currentAccountIndex } = store.chains.stx.default;
  const accountsToRender = Math.max(
    store.chains.stx.default.highestAccountIndex,
    store.chains.stx.default.currentAccountIndex
  );
  if (currentAccountIndex > highestAccountIndex) {
    void analytics?.track('illegal_wallet_state_current_index_higher_than_highest');
  }
  return deriveWalletWithAccounts(defaultInMemoryKey, accountsToRender);
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
const ledgerStacksWalletState = atom(get => {
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

export const stacksWalletState = atom(get => {
  const softwareWallet = get(softwareStacksWalletState);
  const ledgerWallet = get(ledgerStacksWalletState);
  return softwareWallet ? softwareWallet : ledgerWallet;
});
