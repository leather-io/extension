import { bytesToHex } from '@noble/hashes/utils';
import { createSelector } from '@reduxjs/toolkit';
import { HARDENED_OFFSET } from '@scure/bip32';
import {
  AddressVersion,
  createStacksPrivateKey,
  createStacksPublicKey,
  getPublicKey,
  pubKeyfromPrivKey,
  publicKeyToAddress,
} from '@stacks/transactions';
import { deriveStxPrivateKey } from '@stacks/wallet-sdk';
import { atom } from 'jotai';

import { DATA_DERIVATION_PATH, deriveStacksSalt } from '@shared/crypto/stacks/stacks-address-gen';

import { derivePublicKey } from '@app/common/keychain/keychain';
import { createNullArrayOfLength } from '@app/common/utils';
import { storeAtom } from '@app/store';
import { selectStacksChain } from '@app/store/chains/stx-chain.selectors';
import { selectRootKeychain } from '@app/store/in-memory-key/in-memory-key.selectors';
import { selectLedgerKey } from '@app/store/keys/key.selectors';
import { addressNetworkVersionState } from '@app/store/transactions/transaction';

import { defaultKeyId } from '../../../keys/key.slice';
import {
  HardwareStacksAccount,
  SoftwareStacksAccount,
  StacksAccount,
} from './stacks-account.models';

const selectStacksWalletState = createSelector(
  selectRootKeychain,
  selectStacksChain,
  (keychain, chain) => {
    if (!keychain) return;
    const { highestAccountIndex, currentAccountIndex } = chain[defaultKeyId];
    const accountsToRender = Math.max(highestAccountIndex, currentAccountIndex) + 1;

    return createNullArrayOfLength(accountsToRender).map((_, index) => {
      const stxPrivateKey = deriveStxPrivateKey({ rootNode: keychain, index });
      const pubKey = getPublicKey(createStacksPrivateKey(stxPrivateKey));

      const identitiesKeychain = keychain.derive(DATA_DERIVATION_PATH);
      const identityKeychain = identitiesKeychain.deriveChild(index + HARDENED_OFFSET);
      if (!identityKeychain.privateKey)
        throw new Error('Must have private key to derive identities');
      const dataPrivateKey = bytesToHex(identityKeychain.privateKey);

      const appsKey = identityKeychain.deriveChild(0 + HARDENED_OFFSET).privateExtendedKey;

      const salt = deriveStacksSalt(identitiesKeychain);

      return {
        index,
        appsKey,
        dataPrivateKey,
        stxPrivateKey,
        publicKey: pubKey,
        salt,
        mainnetAddress: publicKeyToAddress(AddressVersion.MainnetSingleSig, pubKey),
        testnetAddress: publicKeyToAddress(AddressVersion.TestnetSingleSig, pubKey),
      };
    });
  }
);

const softwareAccountsState = atom<SoftwareStacksAccount[] | undefined>(get => {
  const store = get(storeAtom);
  const addressVersion = get(addressNetworkVersionState);
  const accounts = selectStacksWalletState(store);
  if (!accounts) return undefined;
  return accounts.map(account => {
    const address = publicKeyToAddress(addressVersion, pubKeyfromPrivKey(account.stxPrivateKey));
    const stxPublicKey = derivePublicKey(account.stxPrivateKey);
    const dataPublicKey = derivePublicKey(account.dataPrivateKey);
    return { ...account, type: 'software', address, stxPublicKey, dataPublicKey };
  });
});

const ledgerAccountsState = atom<HardwareStacksAccount[] | undefined>(get => {
  const ledgerWallet = selectLedgerKey(get(storeAtom));
  const addressVersion = get(addressNetworkVersionState);
  if (!ledgerWallet) return undefined;
  return ledgerWallet.publicKeys.map((publicKeys, index) => {
    const address = publicKeyToAddress(
      addressVersion,
      createStacksPublicKey(publicKeys.stxPublicKey)
    );
    return {
      type: 'ledger',
      address,
      stxPublicKey: publicKeys.stxPublicKey,
      dataPublicKey: publicKeys.dataPublicKey,
      index,
    };
  });
});

export const stacksAccountState = atom<StacksAccount[] | undefined>(get => {
  const ledgerAccounts = get(ledgerAccountsState);
  const softwareAccounts = get(softwareAccountsState);
  return ledgerAccounts ?? softwareAccounts;
});
