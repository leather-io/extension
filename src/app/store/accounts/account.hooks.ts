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

export function useCurrentLedgerAccount() {
  const currentKey = useCurrentKeyDetails();
  const transactionVersion = useTransactionNetworkVersion();
  return useMemo(() => {
    if (currentKey?.type === 'ledger') {
      const address = getAddressFromPublicKey(currentKey.publicKeys[0], transactionVersion);
      return { address, stxPublicKey: currentKey.publicKeys[0], index: 0 };
    }
    return;
  }, [currentKey, transactionVersion]);
}

export function useCurrentSoftwareAccount() {
  return useAtomValue(currentAccountState);
}

export function useCurrentAccount() {
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
