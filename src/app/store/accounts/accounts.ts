import { atom } from 'jotai';
import { Account } from '@stacks/wallet-sdk';
import type { Transaction } from '@stacks/stacks-blockchain-api-types';
import { createStacksPublicKey, pubKeyfromPrivKey, publicKeyToAddress } from '@stacks/transactions';

import { ledgerKeyState, softwareWalletState } from '@app/store/wallet/wallet';
import { derivePublicKey } from '@app/common/derive-public-key';
import { addressNetworkVersionState } from '@app/store/transactions/transaction';

import {
  AccountWithAddress,
  LedgerAccountWithAddress,
  SoftwareWalletAccountWithAddress,
} from './account.models';
import { accountTransactionsWithTransfersState } from './transactions';

export const softwareAccountsState = atom<Account[] | undefined>(get => {
  const wallet = get(softwareWalletState);
  if (!wallet) return undefined;
  return wallet.accounts;
});

// map through the accounts and get the address for the current network mode (testnet|mainnet)
const softwareAccountsWithAddressState = atom<SoftwareWalletAccountWithAddress[] | undefined>(
  get => {
    const accounts = get(softwareAccountsState);
    const addressVersion = get(addressNetworkVersionState);
    if (!accounts) return undefined;
    return accounts.map(account => {
      const address = publicKeyToAddress(addressVersion, pubKeyfromPrivKey(account.stxPrivateKey));
      const stxPublicKey = derivePublicKey(account.stxPrivateKey);
      const dataPublicKey = derivePublicKey(account.dataPrivateKey);
      return { ...account, type: 'software', address, stxPublicKey, dataPublicKey };
    });
  }
);

const ledgerAccountsWithAddressState = atom<LedgerAccountWithAddress[] | undefined>(get => {
  const ledgerWallet = get(ledgerKeyState);
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

export const accountsWithAddressState = atom<AccountWithAddress[] | undefined>(get => {
  const ledgerAccounts = get(ledgerAccountsWithAddressState);
  const softwareAccounts = get(softwareAccountsWithAddressState);
  return ledgerAccounts ? ledgerAccounts : softwareAccounts;
});

// This is only used when there is a pending transaction request and
// the user switches accounts during the signing process
export const hasSwitchedAccountsState = atom<boolean>(false);

export const hasCreatedAccountState = atom<boolean>(false);

export const currentAccountConfirmedTransactionsState = atom<Transaction[]>(get => {
  const transactionsWithTransfers = get(accountTransactionsWithTransfersState);
  return transactionsWithTransfers.map(atx => atx.tx);
});
