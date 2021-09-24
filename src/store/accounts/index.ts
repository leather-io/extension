import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { Account, getStxAddress } from '@stacks/wallet-sdk';
import { atomFamily, atomWithDefault, atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';
import BigNumber from 'bignumber.js';
import deepEqual from 'fast-deep-equal';

import { makeLocalDataKey } from '@common/store-utils';
import { transactionRequestStxAddressState } from '@store/transactions/requests';
import { currentNetworkState } from '@store/network/networks';
import { walletState } from '@store/wallet/wallet';
import { transactionNetworkVersionState } from '@store/transactions';
import {
  accountBalancesAnchoredBigNumber,
  accountBalancesUnanchoredBigNumberState,
  accountBalancesUnanchoredClient,
  accountInfoUnanchoredClient,
  accountMempoolTransactionsUnanchoredClient,
  accountTransactionsUnanchoredClient,
} from '@store/accounts/api';
import { AccountWithAddress } from './account.models';
import { accountTransactionsWithTransfersState } from './transactions';
import { DEFAULT_LIST_LIMIT } from '@common/constants';

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
export const accountsState = atomWithDefault<Account[] | undefined>(get => {
  const wallet = get(walletState);
  if (!wallet) return undefined;
  return wallet.accounts;
});

// map through the accounts and get the address for the current network mode (testnet|mainnet)
export const accountsWithAddressState = atom<AccountWithAddress[] | undefined>(get => {
  const accounts = get(accountsState);
  const transactionVersion = get(transactionNetworkVersionState);
  if (!accounts) return undefined;
  return accounts.map(account => {
    const address = getStxAddress({ account, transactionVersion });
    return {
      ...account,
      address,
    };
  });
});

//--------------------------------------
// Current account
//--------------------------------------

// The index of the current account
// persists through sessions (viewings)
export const currentAccountIndexState = atomWithStorage<number>(
  makeLocalDataKey('currentAccountIndex'),
  0
);

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
export const currentAccountState = atom<AccountWithAddress | undefined>(get => {
  const accountIndex = get(currentAccountIndexState);
  const txIndex = get(transactionAccountIndexState);
  const hasSwitched = get(hasSwitchedAccountsState);
  const accounts = get(accountsWithAddressState);

  if (!accounts) return undefined;
  if (typeof txIndex === 'number' && !hasSwitched) return accounts[txIndex];
  return accounts[accountIndex];
});

// gets the address of the current account (in the current network mode)
export const currentAccountStxAddressState = atom<string | undefined>(
  get => get(currentAccountState)?.address
);

// gets the private key of the current account
export const currentAccountPrivateKeyState = atom<string | undefined>(
  get => get(currentAccountState)?.stxPrivateKey
);

export const accountAvailableStxBalanceState = atomFamily<string, BigNumber | undefined>(
  principal =>
    atom(get => {
      const networkUrl = get(currentNetworkState).url;
      const balances = get(accountBalancesAnchoredBigNumber({ principal, networkUrl }));
      if (!balances) return new BigNumber(0);
      return balances.stx.balance.minus(balances.stx.locked);
    }),
  deepEqual
);

export const currentAccountAvailableStxBalanceState = atom(get => {
  const principal = get(currentAccountStxAddressState);
  if (!principal) return;
  return get(accountAvailableStxBalanceState(principal));
});

// the unanchored balances of the current account's address
export const currentAccountBalancesUnanchoredState = atom(get => {
  const principal = get(currentAccountStxAddressState);
  const networkUrl = get(currentNetworkState).url;
  if (!principal) return;
  return get(accountBalancesUnanchoredBigNumberState({ principal, networkUrl }));
});

// the anchored balances of the current account's address
export const currentAnchoredAccountBalancesState = atom(get => {
  const principal = get(currentAccountStxAddressState);
  const networkUrl = get(currentNetworkState).url;
  if (!principal) return;
  return get(accountBalancesAnchoredBigNumber({ principal, networkUrl }));
});

export const currentAccountConfirmedTransactionsState = atom<Transaction[]>(get => {
  const transactionsWithTransfers = get(accountTransactionsWithTransfersState);
  return transactionsWithTransfers.map(atx => atx.tx);
});

export const currentAccountMempoolTransactionsState = atom<MempoolTransaction[]>(get => {
  const principal = get(currentAccountStxAddressState);
  const networkUrl = get(currentNetworkState).url;
  if (!principal) return [];
  const mempool = get(
    accountMempoolTransactionsUnanchoredClient({
      principal,
      limit: DEFAULT_LIST_LIMIT,
      networkUrl,
    })
  );
  return mempool?.pages[0].results || [];
});

// combo of pending and confirmed transactions for the current address
export const currentAccountTransactionsState = atom<(MempoolTransaction | Transaction)[]>(get => {
  const transactions = get(currentAccountConfirmedTransactionsState);
  const pending = get(currentAccountMempoolTransactionsState);
  return [...pending, ...transactions];
});

export const currentAccountInfoState = atom(get => {
  const principal = get(currentAccountStxAddressState);
  const networkUrl = get(currentNetworkState).url;
  if (!principal) return;
  return get(accountInfoUnanchoredClient({ principal, networkUrl }));
});

export const refreshAccountDataState = atom(null, (get, set) => {
  const principal = get(currentAccountStxAddressState);
  const networkUrl = get(currentNetworkState).url;
  if (!principal) return;
  set(
    accountMempoolTransactionsUnanchoredClient({
      principal,
      limit: DEFAULT_LIST_LIMIT,
      networkUrl,
    }),
    {
      type: 'refetch',
    }
  );
  set(accountTransactionsUnanchoredClient({ principal, limit: DEFAULT_LIST_LIMIT, networkUrl }), {
    type: 'refetch',
  });
  set(accountBalancesUnanchoredClient({ principal, networkUrl }), { type: 'refetch' });
  set(accountInfoUnanchoredClient({ principal, networkUrl }), { type: 'refetch' });
});

accountsState.debugLabel = 'accountsState';
accountsWithAddressState.debugLabel = 'accountsWithAddressState';
currentAccountIndexState.debugLabel = 'currentAccountIndexState';
hasSwitchedAccountsState.debugLabel = 'hasSwitchedAccountsState';
transactionAccountIndexState.debugLabel = 'transactionAccountIndexState';
currentAccountState.debugLabel = 'currentAccountState';
currentAccountStxAddressState.debugLabel = 'currentAccountStxAddressState';
currentAccountPrivateKeyState.debugLabel = 'currentAccountPrivateKeyState';
currentAccountBalancesUnanchoredState.debugLabel = 'currentAccountBalancesState';
currentAccountTransactionsState.debugLabel = 'currentAccountTransactionsState';
