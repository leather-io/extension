import { createStacksPublicKey, pubKeyfromPrivKey, publicKeyToAddress } from '@stacks/transactions';
import { atom } from 'jotai';

import { derivePublicKey } from '@app/common/keychain/keychain';
import { storeAtom } from '@app/store';
import { softwareStacksWalletState } from '@app/store/keys/blockchain/stacks-keychain';
import { selectLedgerKey } from '@app/store/keys/key.selectors';
import { addressNetworkVersionState } from '@app/store/transactions/transaction';

import {
  HardwareStacksAccount,
  SoftwareStacksAccount,
  StacksAccount,
} from './stacks-account.models';

const softwareAccountsState = atom<SoftwareStacksAccount[] | undefined>(get => {
  const wallet = get(softwareStacksWalletState);
  const addressVersion = get(addressNetworkVersionState);
  if (!wallet) return undefined;
  return wallet.accounts.map(account => {
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

export const accountsWithAddressState = atom<StacksAccount[] | undefined>(get => {
  const ledgerAccounts = get(ledgerAccountsState);
  const softwareAccounts = get(softwareAccountsState);
  return ledgerAccounts ? ledgerAccounts : softwareAccounts;
});

// This is only used when there is a pending transaction request and
// the user switches accounts during the signing process
export const hasSwitchedAccountsState = atom<boolean>(false);

export const hasCreatedAccountState = atom<boolean>(false);
