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
import { transformAssets } from '@app/store/assets/utils';

function initAmountsAsBigNumber(balances: AddressBalanceResponse): AccountBalanceResponseBigNumber {
  const stxBigNumbers = Object.fromEntries(
    accountBalanceStxKeys.map(key => [key, new BigNumber(balances.stx[key])])
  ) as Record<AccountBalanceStxKeys, BigNumber>;

  const stx: AccountStxBalanceBigNumber = { ...balances.stx, ...stxBigNumbers };
  return { ...balances, stx };
}

export function useAddressBalances(address: string) {
  const setAccountBalanceUnanchoredState = useSetAccountBalancesUnanchoredState();
  return useGetAccountBalanceQuery(address, {
    select: (resp: AddressBalanceResponse) => {
      const balances = initAmountsAsBigNumber(resp);
      return { ...balances, availableStx: balances.stx.balance.minus(balances.stx.locked) };
    },
    onSuccess: (resp: ReturnType<typeof initAmountsAsBigNumber>) =>
      setAccountBalanceUnanchoredState(resp),
    keepPreviousData: false,
    useErrorBoundary: false,
    refetchOnMount: false,
    suspense: false,
  });
}

export function useCurrentAccountUnanchoredBalances() {
  const account = useCurrentAccount();
  return useAddressBalances(account?.address || '');
}

export function useBaseAssetsUnachored() {
  const balances = useCurrentAccountUnanchoredBalances();
  return transformAssets(balances.data);
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
