import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import type {
  AccountBalanceResponseBigNumber,
  AccountBalanceStxKeys,
  AccountStxBalanceBigNumber,
  AddressBalanceResponse,
} from '@shared/models/account-types';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { accountBalanceStxKeys } from '@app/store/accounts/account.models';
import { transformAssets } from '@app/store/assets/utils';
import { AccountWithAddress } from '@app/store/accounts/account.models';

import {
  useGetAccountBalanceQuery,
  useGetAnchoredAccountBalanceListQuery,
  useGetAnchoredAccountBalanceQuery,
} from './balance.query';
import { createMoney, Money } from '@shared/models/money.model';

function initAmountsAsMoney(balances: AddressBalanceResponse): AccountBalanceResponseBigNumber {
  const stxMoney = Object.fromEntries(
    accountBalanceStxKeys.map(key => [
      key,
      { amount: new BigNumber(balances.stx[key]), symbol: 'STX' },
    ])
  ) as Record<AccountBalanceStxKeys, Money>;

  const stx: AccountStxBalanceBigNumber = { ...balances.stx, ...stxMoney };
  return { ...balances, stx };
}

export function useAddressBalances(address: string) {
  return useGetAccountBalanceQuery(address, {
    select: (resp: AddressBalanceResponse) => {
      const balances = initAmountsAsMoney(resp);
      return {
        ...balances,
        availableStx: createMoney(
          balances.stx.balance.amount.minus(balances.stx.locked.amount),
          'STX'
        ),
      };
    },
    keepPreviousData: false,
    useErrorBoundary: false,
    suspense: false,
  });
}

export function useCurrentAccountUnanchoredBalances() {
  const account = useCurrentAccount();
  return useAddressBalances(account?.address || '');
}

export function useBaseAssetsUnanchored() {
  const balances = useCurrentAccountUnanchoredBalances();
  return useMemo(() => {
    return transformAssets(balances.data);
  }, [balances]);
}

function useAddressAnchoredBalances(address: string) {
  const { data: balances } = useGetAnchoredAccountBalanceQuery(address, {
    select: (resp: AddressBalanceResponse) => initAmountsAsMoney(resp),
    retryOnMount: true,
    keepPreviousData: false,
  });
  return balances;
}

export function useCurrentAccountAnchoredBalances() {
  const account = useCurrentAccount();
  return useAddressAnchoredBalances(account?.address || '');
}

export function useAddressAnchoredAvailableStxBalance(address: string) {
  const balances = useAddressAnchoredBalances(address);
  return useMemo(() => {
    if (!balances) return new BigNumber(0);
    return balances.stx.balance.amount.minus(balances.stx.locked.amount);
  }, [balances]);
}

export function useCurrentAccountAvailableStxBalance() {
  const account = useCurrentAccount();
  return useAddressAnchoredAvailableStxBalance(account?.address || '');
}

export function useAllAccountsAvailableStxBalance(accounts?: AccountWithAddress[]) {
  const accountsBalances = useGetAnchoredAccountBalanceListQuery(accounts);
  return useMemo(() => {
    return accountsBalances.reduce((acc, balance) => {
      return acc.plus(balance.data?.stx.balance || 0);
    }, new BigNumber(0));
  }, [accountsBalances]);
}
