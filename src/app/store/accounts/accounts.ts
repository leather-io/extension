import { atom } from 'jotai';
import { Account } from '@stacks/wallet-sdk';
import type { Transaction } from '@stacks/stacks-blockchain-api-types';
import { createStacksPublicKey, pubKeyfromPrivKey, publicKeyToAddress } from '@stacks/transactions';

import { transactionRequestStxAddressState } from '@app/store/transactions/requests';
import {
  currentAccountIndexState,
  ledgerKeyState,
  softwareWalletState,
} from '@app/store/wallet/wallet';
import { derivePublicKey } from '@app/common/derive-public-key';
import { addressNetworkVersionState } from '@app/store/transactions/transaction';

import {
  AccountWithAddress,
  LedgerAccountWithAddress,
  SoftwareWalletAccountWithAddress,
} from './account.models';
import { accountTransactionsWithTransfersState } from './transactions';
import { signatureRequestAccountIndex } from '../signatures/requests';

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

// if there is a pending transaction that has a stxAccount param
// find the index from the accounts atom and return it
export const transactionAccountIndexState = atom<number | undefined>(get => {
  const accounts = get(accountsWithAddressState);
  const txAddress = get(transactionRequestStxAddressState);

  if (txAddress && accounts) {
    return accounts.findIndex(account => account.address === txAddress); // selected account
  }
  return undefined;
});

// This contains the state of the current account:
// could be the account associated with an in-process transaction request
// or the last selected / first account of the user
export const currentAccountState = atom<AccountWithAddress | undefined>(get => {
  const accountIndex = get(currentAccountIndexState);
  const txIndex = get(transactionAccountIndexState) ?? get(signatureRequestAccountIndex);
  const hasSwitched = get(hasSwitchedAccountsState);
  const accounts = get(accountsWithAddressState);

  if (!accounts) return undefined;
  if (typeof txIndex === 'number' && !hasSwitched) return accounts[txIndex];
  return accounts[accountIndex] as AccountWithAddress | undefined;
});

// gets the address of the current account (in the current network mode)
export const currentAccountStxAddressState = atom<string | undefined>(
  get => get(currentAccountState)?.address
);

export const currentAccountConfirmedTransactionsState = atom<Transaction[]>(get => {
  const transactionsWithTransfers = get(accountTransactionsWithTransfersState);
  return transactionsWithTransfers.map(atx => atx.tx);
});
