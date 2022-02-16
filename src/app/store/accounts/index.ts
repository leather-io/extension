import { Account } from '@stacks/wallet-sdk';

import { atomFamily } from 'jotai/utils';
import type {
  AccountDataResponse,
  MempoolTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

import { atom } from 'jotai';
import BigNumber from 'bignumber.js';
import deepEqual from 'fast-deep-equal';

import { transactionRequestStxAddressState } from '@app/store/transactions/requests';
import { currentNetworkState } from '@app/store/network/networks';

import { addressNetworkVersionState } from '@app/store/transactions';
import {
  currentAccountIndexState,
  ledgerWalletState,
  softwareWalletState,
} from '@app/store/wallet/wallet';

import {
  accountBalancesAnchoredBigNumber,
  accountBalancesUnanchoredClient,
  accountTransactionsUnanchoredClient,
} from '@app/store/accounts/api';
import {
  AccountWithAddress,
  LedgerAccountWithAddress,
  SoftwareWalletAccountWithAddress,
} from './account.models';
import { accountTransactionsWithTransfersState } from './transactions';
import { DEFAULT_LIST_LIMIT } from '@shared/constants';
import { createStacksPublicKey, pubKeyfromPrivKey, publicKeyToAddress } from '@stacks/transactions';
import { AccountBalanceResponseBigNumber } from '@shared/models/account-types';
import { derivePublicKey } from '@app/common/derive-public-key';

/**
 * --------------------------------------
 * Overview
 * --------------------------------------
 *
 * accountsState -- the array of accounts from the wallet state, uses `walletState`
 * accountsWithAddressState - a mapped array of the above state with the current network mode stx address included
 * currentAccountIndexStore - the last selected index by the user (or default 0)
 * hasSwitchedAccountsState - a toggle for when a user switches accounts during a pending transaction request
 * transactionAccountIndexState - if `stxAccount` is passed with a transaction request, this is the index of that address
 * currentAccountState - the current active account, either the account associated with a pending transaction request, or the one selected by the user
 * currentAccountStxAddressState - a selector for the address of the current account
 * currentAccountAvailableStxBalanceState - the available STX balance of the current account
 * accountDataState - all external API data for the selected STX address
 * accountAvailableStxBalanceState - the available STX balance for the STX address
 * accountBalancesState - a selector for the balances from `accountDataState`
 * accountInfoState - external API data from the `v2/accounts` endpoint, should be the most up-to-date
 */

//--------------------------------------
// All accounts
//--------------------------------------
export const softwareAccountsState = atom<Account[] | undefined>(get => {
  const wallet = get(softwareWalletState);
  if (!wallet) return undefined;
  return wallet.accounts;
});

// map through the accounts and get the address for the current network mode (testnet|mainnet)
export const softwareAccountsWithAddressState = atom<
  SoftwareWalletAccountWithAddress[] | undefined
>(get => {
  const accounts = get(softwareAccountsState);
  const addressVersion = get(addressNetworkVersionState);
  if (!accounts) return undefined;

  return accounts.map(account => {
    const address = publicKeyToAddress(addressVersion, pubKeyfromPrivKey(account.stxPrivateKey));
    const stxPublicKey = derivePublicKey(account.stxPrivateKey);
    const dataPublicKey = derivePublicKey(account.dataPrivateKey);
    return { ...account, type: 'software', address, stxPublicKey, dataPublicKey };
  });
});

export const ledgerAccountsWithAddressState = atom<LedgerAccountWithAddress[] | undefined>(get => {
  const ledgerWallet = get(ledgerWalletState);
  const addressVersion = get(addressNetworkVersionState);
  if (!ledgerWallet) return undefined;

  return ledgerWallet.publicKeys.map((publicKey, index) => {
    const address = publicKeyToAddress(addressVersion, createStacksPublicKey(publicKey));
    return { type: 'ledger', address, stxPublicKey: publicKey, index };
  });
});

export const accountsWithAddressState = atom<AccountWithAddress[] | undefined>(get => {
  const ledgerAccounts = get(ledgerAccountsWithAddressState);
  const softwareAccounts = get(softwareAccountsWithAddressState);

  return ledgerAccounts ? ledgerAccounts : softwareAccounts;
});

//--------------------------------------
// Current account
//--------------------------------------

// This is only used when there is a pending transaction request and
// the user switches accounts during the signing process
export const hasSwitchedAccountsState = atom<boolean>(false);

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
export const currentAccountState = atom<SoftwareWalletAccountWithAddress | undefined>(get => {
  const accountIndex = get(currentAccountIndexState);
  const txIndex = get(transactionAccountIndexState);
  const hasSwitched = get(hasSwitchedAccountsState);
  const accounts = get(accountsWithAddressState);

  console.log({
    accountIndex,
    txIndex,
    hasSwitched,
    accounts,
  });

  if (!accounts) return undefined;
  if (typeof txIndex === 'number' && !hasSwitched) return accounts[txIndex];
  return accounts[accountIndex];
});

// gets the address of the current account (in the current network mode)
export const currentAccountStxAddressState = atom<string | undefined>(
  get => get(currentAccountState)?.address
);

const accountAvailableAnchoredStxBalanceState = atomFamily(
  principal =>
    atom(get => {
      const networkUrl = get(currentNetworkState).url;
      const balances = get(accountBalancesAnchoredBigNumber({ principal, networkUrl }));
      if (!balances) return new BigNumber(0);
      return balances.stx.balance.minus(balances.stx.locked);
    }),
  deepEqual
);

export const currentAccountAvailableAnchoredStxBalanceState = atom(get => {
  const principal = get(currentAccountStxAddressState);
  if (!principal) return;
  return get(accountAvailableAnchoredStxBalanceState(principal));
});

/**
 * @deprecated
 * Use `useAddressBalances`
 */
export const currentAccountBalancesUnanchoredState = atom<
  AccountBalanceResponseBigNumber | undefined
>(undefined);

/**
 * @deprecated
 * Use `useAddressBalances`
 */
export const currentAnchoredAccountBalancesState = atom(get => {
  const principal = get(currentAccountStxAddressState);
  const networkUrl = get(currentNetworkState).url;
  console.log(principal, networkUrl);
  if (!principal) return;
  return get(accountBalancesAnchoredBigNumber({ principal, networkUrl }));
});

export const currentAccountConfirmedTransactionsState = atom<Transaction[]>(get => {
  const transactionsWithTransfers = get(accountTransactionsWithTransfersState);
  return transactionsWithTransfers.map(atx => atx.tx);
});

/**
 * @deprecated
 * Populated by mempool `useQuery`
 */
export const currentAccountMempoolTransactionsState = atom<MempoolTransaction[]>([]);

/** @deprecated */
export const currentAccountTransactionsState = atom<(MempoolTransaction | Transaction)[]>(get => {
  const transactions = get(currentAccountConfirmedTransactionsState);
  const pending = get(currentAccountMempoolTransactionsState);
  return [...pending, ...transactions];
});

export const currentAccountInfoState = atom<AccountDataResponse | undefined>(undefined);

export const refreshAccountDataState = atom(null, (get, set) => {
  const principal = get(currentAccountStxAddressState);
  const networkUrl = get(currentNetworkState).url;
  if (!principal) return;
  set(accountTransactionsUnanchoredClient({ principal, limit: DEFAULT_LIST_LIMIT, networkUrl }), {
    type: 'refetch',
  });
  set(accountBalancesUnanchoredClient({ principal, networkUrl }), { type: 'refetch' });
});
