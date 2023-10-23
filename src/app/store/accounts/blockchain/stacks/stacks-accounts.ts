import { bytesToHex } from '@noble/hashes/utils';
import { createSelector } from '@reduxjs/toolkit';
import { HARDENED_OFFSET, HDKey } from '@scure/bip32';
import { ChainID } from '@stacks/common';
import {
  AddressVersion,
  createStacksPrivateKey,
  createStacksPublicKey,
  getPublicKey,
  pubKeyfromPrivKey,
  publicKeyToAddress,
} from '@stacks/transactions';
import { deriveStxPrivateKey, generateWallet } from '@stacks/wallet-sdk';
import { atom } from 'jotai';

import { DATA_DERIVATION_PATH, deriveStacksSalt } from '@shared/crypto/stacks/stacks-address-gen';
import { defaultWalletKeyId } from '@shared/utils';

import { derivePublicKey } from '@app/common/keychain/keychain';
import { createNullArrayOfLength, whenStacksChainId } from '@app/common/utils';
import { storeAtom } from '@app/store';
import { selectStacksChain } from '@app/store/chains/stx-chain.selectors';
import {
  selectDefaultWalletKey,
  selectRootKeychain,
} from '@app/store/in-memory-key/in-memory-key.selectors';
import { selectDefaultWalletStacksKeys } from '@app/store/ledger/stacks/stacks-key.slice';
import { currentNetworkAtom } from '@app/store/networks/networks';

import {
  HardwareStacksAccount,
  SoftwareStacksAccount,
  StacksAccount,
} from './stacks-account.models';

function initalizeStacksAccount(rootKeychain: HDKey, index: number) {
  const stxPrivateKey = deriveStxPrivateKey({ rootNode: rootKeychain, index } as any);
  const pubKey = getPublicKey(createStacksPrivateKey(stxPrivateKey));

  const identitiesKeychain = rootKeychain.derive(DATA_DERIVATION_PATH);
  const identityKeychain = identitiesKeychain.deriveChild(index + HARDENED_OFFSET);
  if (!identityKeychain.privateKey) throw new Error('Must have private key to derive identities');
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
}

const stacksAddressNetworkVersionState = atom(get => {
  const currentNetwork = get(currentNetworkAtom);

  return whenStacksChainId(currentNetwork.chain.stacks.chainId)({
    [ChainID.Mainnet]: AddressVersion.MainnetSingleSig,
    [ChainID.Testnet]: AddressVersion.TestnetSingleSig,
  });
});

const selectStacksWalletState = createSelector(
  selectRootKeychain,
  selectStacksChain,
  (keychain, chain) => {
    if (!keychain) return;
    const { highestAccountIndex, currentAccountIndex } = chain[defaultWalletKeyId];
    const numberOfAccountsToDerive = Math.max(highestAccountIndex, currentAccountIndex) + 1;
    return createNullArrayOfLength(numberOfAccountsToDerive).map((_, index) =>
      initalizeStacksAccount(keychain, index)
    );
  }
);

const softwareAccountsState = atom<SoftwareStacksAccount[] | undefined>(get => {
  const store = get(storeAtom);
  const addressVersion = get(stacksAddressNetworkVersionState) || AddressVersion.TestnetSingleSig;
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
  const addressVersion = get(stacksAddressNetworkVersionState);
  const ledgerKeys = selectDefaultWalletStacksKeys(get(storeAtom));

  return ledgerKeys.map((publicKeys, index) => {
    const address = publicKeyToAddress(
      addressVersion,
      createStacksPublicKey(publicKeys.stxPublicKey)
    );
    return {
      ...publicKeys,
      type: 'ledger',
      address,
      stxPublicKey: publicKeys.stxPublicKey,
      dataPublicKey: publicKeys.dataPublicKey,
      index,
    };
  });
});

export const stacksAccountState = atom<StacksAccount[]>(get => {
  const ledgerAccounts = get(ledgerAccountsState);
  const softwareAccounts = get(softwareAccountsState);

  if (ledgerAccounts?.length) {
    return ledgerAccounts;
  }

  return softwareAccounts ?? [];
});

/**
 * @deprecated
 * This method mocks the `Wallet` type from `@stacks/wallet-sdk`. Internally,
 * this library makes assumptions about how we want to use it. Such as
 * requesting BNS names (1 request per account). If you have many accounts, this
 * adds a huge loading time and stalls the wallet. Some parts of the code rely
 * on the `Wallet` type still, so here we mock it by manipulating it directly
 * (sans unwanted http requests).
 */
export const legacyStackWallet = atom(async get => {
  const store = get(storeAtom);
  const secretKey = selectDefaultWalletKey(store);
  const accounts = get(softwareAccountsState);
  if (!secretKey) return;
  const wallet = await generateWallet({ secretKey, password: '' });
  wallet.accounts = accounts ?? [];
  return wallet;
});
