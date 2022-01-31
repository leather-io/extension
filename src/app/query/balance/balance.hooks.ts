import BigNumber from 'bignumber.js';

import type {
  AccountBalanceResponseBigNumber,
  AccountBalanceStxKeys,
  AccountStxBalanceBigNumber,
  AddressBalanceResponse,
} from '@shared/models/account-types';

import {
  useCurrentAccount,
  useSetAccountBalancesUnanchoredState,
} from '@app/store/accounts/account.hooks';
import { useGetAccountBalanceQuery, useGetAnchoredAccountBalanceQuery } from './balance.query';
import { accountBalanceStxKeys } from '@app/store/accounts/account.models';
import { useMemo } from 'react';

function initAmountsAsBigNumber(balances: AddressBalanceResponse): AccountBalanceResponseBigNumber {
  const stxBigNumbers = Object.fromEntries(
    accountBalanceStxKeys.map(key => [key, new BigNumber(balances.stx[key])])
  ) as Record<AccountBalanceStxKeys, BigNumber>;

  const stx: AccountStxBalanceBigNumber = { ...balances.stx, ...stxBigNumbers };
  return { ...balances, stx };
}

export function useAddressBalances(address: string) {
  const setAccountBalanceUnanchoredState = useSetAccountBalancesUnanchoredState();
  const { data: balances } = useGetAccountBalanceQuery(address, {
    select: (resp: AddressBalanceResponse) => initAmountsAsBigNumber(resp),
    onSuccess: (resp: ReturnType<typeof initAmountsAsBigNumber>) =>
      setAccountBalanceUnanchoredState(resp),
    retryOnMount: true,
    keepPreviousData: false,
  });
  return balances;
}

export function useCurrentAccountUnanchoredBalances() {
  const account = useCurrentAccount();
  return useAddressBalances(account?.address || '');
}

export function useAddressAvailableStxBalance(address: string) {
  const balances = useAddressBalances(address);
  return useMemo(() => {
    if (!balances) return new BigNumber(0);
    return balances.stx.balance.minus(balances.stx.locked);
  }, [balances]);
}

function useAddressAnchoredBalances(address: string) {
  const { data: balances } = useGetAnchoredAccountBalanceQuery(address, {
    select: (resp: AddressBalanceResponse) => initAmountsAsBigNumber(resp),
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
  if (!balances) return new BigNumber(0);
  return balances.stx.balance.minus(balances.stx.locked);
}
