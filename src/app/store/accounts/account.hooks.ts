import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';

import {
  addressNetworkVersionState,
  transactionNetworkVersionState,
} from '@app/store/transactions/transaction';
import {
  accountsWithAddressState,
  currentAccountConfirmedTransactionsState,
  currentAccountState,
  currentAccountStxAddressState,
  hasSwitchedAccountsState,
  hasCreatedAccountState,
  transactionAccountIndexState,
} from '@app/store/accounts/accounts';

import { currentAccountIndexState } from '../wallet/wallet';

export function useAccountConfirmedTransactions() {
  return useAtomValue(currentAccountConfirmedTransactionsState);
}

export function useAccounts() {
  return useAtomValue(accountsWithAddressState);
}

export function useCurrentAccountStxAddressState() {
  return useAtomValue(currentAccountStxAddressState);
}

export function useCurrentAccount() {
  return useAtomValue(currentAccountState);
}

export function useCurrentAccountIndex() {
  return useAtomValue(currentAccountIndexState);
}

export function useTransactionAccountIndex() {
  return useAtomValue(transactionAccountIndexState);
}

export function useTransactionNetworkVersion() {
  return useAtomValue(transactionNetworkVersionState);
}

export function useAddressNetworkVersion() {
  return useAtomValue(addressNetworkVersionState);
}

export function useHasSwitchedAccounts() {
  return useAtom(hasSwitchedAccountsState);
}

export function useHasCreatedAccount() {
  return useAtom(hasCreatedAccountState);
}
