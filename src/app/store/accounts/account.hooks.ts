import { useMemo } from 'react';

import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';

import { BITCOIN_TEST_ADDRESS } from '@shared/constants';

import {
  accountsWithAddressState,
  hasCreatedAccountState,
  hasSwitchedAccountsState,
} from '@app/store/accounts/accounts';
import { useSignatureRequestAccountIndex } from '@app/store/signatures/requests.hooks';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';
import { transactionNetworkVersionState } from '@app/store/transactions/transaction';
import { currentAccountIndexState } from '@app/store/wallet/wallet';

import { AccountWithAddress } from './account.models';

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

// TODO: Needs to be handled with btc addresses work
// Move account addresses state to redux?
export function useCurrentAccountBtcAddressState() {
  return BITCOIN_TEST_ADDRESS;
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

export function useHasSwitchedAccounts() {
  return useAtom(hasSwitchedAccountsState);
}

export function useHasCreatedAccount() {
  return useAtom(hasCreatedAccountState);
}
