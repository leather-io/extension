import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import {
  accountAvailableStxBalanceState,
  accountsWithAddressState,
  currentAccountAvailableStxBalanceState,
  currentAccountBalancesUnanchoredState,
  currentAccountConfirmedTransactionsState,
  currentAccountIndexState,
  currentAccountInfoState,
  currentAccountMempoolTransactionsState,
  currentAccountState,
  currentAccountStxAddressState,
  currentAccountTransactionsState,
  hasSwitchedAccountsState,
  refreshAccountDataState,
  transactionAccountIndexState,
} from '@store/accounts';
import { allAccountsNameState, currentAccountNameState } from './names';
import { transactionNetworkVersionState } from '@store/transactions';
import { useAtom } from 'jotai';

export const useAccountAvailableStxBalance = (address: string) => {
  return useAtomValue(accountAvailableStxBalanceState(address));
};

export function useCurrentAccountAvailableStxBalance() {
  return useAtomValue(currentAccountAvailableStxBalanceState);
}

export function useAccountActivity() {
  return useAtomValue(currentAccountTransactionsState);
}

export function useCurrentAccountBalancesUnanchoredState() {
  return useAtomValue(currentAccountBalancesUnanchoredState);
}

export function useCurrentAccountConfirmedTransactionsState() {
  return useAtomValue(currentAccountConfirmedTransactionsState);
}

export function useCurrentAccountMempoolTransactionsState() {
  return useAtomValue(currentAccountMempoolTransactionsState);
}

export function useAccountNames() {
  return useAtomValue(allAccountsNameState);
}

export function useCurrentAccountNames() {
  return useAtomValue(currentAccountNameState);
}

export function useAccounts() {
  return useAtomValue(accountsWithAddressState);
}

export function useCurrentAccountStxAddressState() {
  return useAtomValue(currentAccountStxAddressState);
}

export function useCurrentAccountInfo() {
  return useAtomValue(currentAccountInfoState);
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

export function useHasSwitchedAccounts() {
  return useAtom(hasSwitchedAccountsState);
}

export function useRefreshAccountData() {
  return useUpdateAtom(refreshAccountDataState);
}
