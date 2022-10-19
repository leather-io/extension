import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';

import {
  addressNetworkVersionState,
  transactionNetworkVersionState,
} from '@app/store/transactions/transaction';
import {
  currentAccountConfirmedTransactionsState,
  hasSwitchedAccountsState,
  hasCreatedAccountState,
  accountsWithAddressState,
} from '@app/store/accounts/accounts';
import { currentAccountIndexState } from '@app/store/wallet/wallet';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';
import { useSignatureRequestAccountIndex } from '@app/store/signatures/requests.hooks';

import { AccountWithAddress } from './account.models';

export function useAccountConfirmedTransactions() {
  return useAtomValue(currentAccountConfirmedTransactionsState);
}

export function useAccounts() {
  return useAtomValue(accountsWithAddressState);
}

// Comment below from original atom. This pattern encourages view level
// implementation details to leak into the state structure. Do not do this.
//   This contains the state of the current account:
//   could be the account associated with an in-process transaction request
//   or the last selected / first account of the user
export function useCurrentAccount() {
  const accountIndex = useCurrentAccountIndex();
  const txIndex = useTransactionAccountIndex();
  const signatureIndex = useSignatureRequestAccountIndex();
  // ⚠️ to refactor, we should not just continually add new conditionals here
  const hasSwitched = useAtomValue(hasSwitchedAccountsState);
  const accounts = useAccounts();

  return useMemo(() => {
    const index = txIndex ?? signatureIndex;
    if (!accounts) return undefined;
    if (typeof index === 'number' && !hasSwitched) return accounts[index];
    return accounts[accountIndex] as AccountWithAddress | undefined;
  }, [accountIndex, accounts, hasSwitched, signatureIndex, txIndex]);
}

export function useCurrentAccountStxAddressState() {
  return useCurrentAccount()?.address ?? '';
}

export function useCurrentAccountIndex() {
  return useAtomValue(currentAccountIndexState);
}

export function useTransactionAccountIndex() {
  const accounts = useAtomValue(accountsWithAddressState);
  const txPayload = useTransactionRequestState();
  const txAddress = txPayload?.stxAddress;

  return useMemo(() => {
    if (txAddress && accounts) {
      return accounts.findIndex(account => account.address === txAddress); // selected account
    }
    return undefined;
  }, [accounts, txAddress]);
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
