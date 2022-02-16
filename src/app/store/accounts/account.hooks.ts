import { useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import {
  addressNetworkVersionState,
  transactionNetworkVersionState,
} from '@app/store/transactions';
import {
  accountsWithAddressState,
  currentAccountAvailableAnchoredStxBalanceState,
  currentAccountBalancesUnanchoredState,
  currentAccountConfirmedTransactionsState,
  currentAccountInfoState,
  currentAccountMempoolTransactionsState,
  currentAccountState,
  currentAccountStxAddressState,
  hasSwitchedAccountsState,
  refreshAccountDataState,
  transactionAccountIndexState,
} from '@app/store/accounts';
import { currentAccountIndexState } from '../wallet/wallet';
import { useCurrentKeyDetails } from '../keys/key.selectors';
import { getAddressFromPublicKey } from '@stacks/transactions';
import { useMemo } from 'react';
import {
  AccountWithAddress,
  LedgerAccountWithAddress,
  SoftwareWalletAccountWithAddress,
} from './account.models';

export function useCurrentAccountAvailableStxBalance() {
  return useAtomValue(currentAccountAvailableAnchoredStxBalanceState);
}

export function useAccountConfirmedTransactions() {
  return useAtomValue(currentAccountConfirmedTransactionsState);
}

export function useSetMempoolTransactions() {
  return useUpdateAtom(currentAccountMempoolTransactionsState);
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

// Currently only works with one account
export function useCurrentLedgerAccount(): LedgerAccountWithAddress | undefined {
  const currentKey = useCurrentKeyDetails();
  const transactionVersion = useTransactionNetworkVersion();
  return useMemo(() => {
    if (!currentKey || currentKey.type !== 'ledger') return;
    const address = getAddressFromPublicKey(currentKey.publicKeys[0], transactionVersion);
    return {
      type: 'ledger',
      address,
      stxPublicKey: currentKey.publicKeys[0],
      index: 0,
    };
  }, [currentKey, transactionVersion]);
}

export function useCurrentSoftwareAccount(): SoftwareWalletAccountWithAddress | undefined {
  return useAtomValue(currentAccountState);
}

export function useCurrentAccount(): AccountWithAddress {
  const ledgerAccount = useCurrentLedgerAccount();
  // console.log(ledgerAccount);
  const softwareAccount = useAtomValue(currentAccountState);
  if (ledgerAccount) {
    return ledgerAccount;
  }
  return softwareAccount;
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

export function useRefreshAccountData() {
  return useUpdateAtom(refreshAccountDataState);
}

export function useSetAccountBalancesUnanchoredState() {
  return useUpdateAtom(currentAccountBalancesUnanchoredState);
}

export function useSetAccountInfo() {
  return useUpdateAtom(currentAccountInfoState);
}
